/*
define([
    'text!fixtures/index.html',
    'collections/PayrollPayments/filterCollection',
    'views/main/MainView',
    'views/PayrollPayments/list/ListView',
    'views/PayrollPayments/TopBarView',
    'views/PayrollPayments/CreateView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, PayRollPaymentsCollection, MainView, ListView, TopBarView, CreateView, $, chai, chaiJquery, sinonChai, Custom, async) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [
        {
            "_id": 19,
            "attachments": [],
            "link": false,
            "mname": "Sales",
            "parrent": null,
            "sequence": 1,
            "visible": true,
            "ancestors": [],
            "href": "Sales"
        }, {
            "_id": 36,
            "attachments": [],
            "link": false,
            "mname": "Project",
            "parrent": null,
            "sequence": 2,
            "visible": true,
            "ancestors": [],
            "href": "Project"
        }, {
            "_id": 9,
            "attachments": [],
            "link": false,
            "mname": "HR",
            "parrent": null,
            "sequence": 3,
            "visible": true,
            "ancestors": [],
            "href": "HR"
        }, {
            "_id": 49,
            "attachments": [],
            "htref": "persons",
            "link": true,
            "mname": "Persons",
            "parrent": 19,
            "sequence": 7,
            "visible": true,
            "ancestors": [],
            "href": "Persons"
        }, {
            "_id": 50,
            "attachments": [],
            "htref": "persons",
            "link": true,
            "mname": "Companies",
            "parrent": 19,
            "sequence": 8,
            "visible": true,
            "ancestors": [],
            "href": "Companies"
        }, {
            "_id": 24,
            "attachments": [],
            "link": true,
            "mname": "Leads",
            "parrent": 19,
            "sequence": 9,
            "visible": true,
            "ancestors": [],
            "href": "Leads"
        }, {
            "_id": 25,
            "attachments": [],
            "link": true,
            "mname": "Opportunities",
            "parrent": 19,
            "sequence": 10,
            "visible": true,
            "ancestors": [],
            "href": "Opportunities"
        }, {
            "_id": 39,
            "attachments": [],
            "link": true,
            "mname": "Projects",
            "parrent": 36,
            "sequence": 23,
            "visible": true,
            "ancestors": [],
            "href": "Projects"
        }, {
            "_id": 40,
            "attachments": [],
            "link": true,
            "mname": "Tasks",
            "parrent": 36,
            "sequence": 24,
            "visible": true,
            "ancestors": [],
            "href": "Tasks"
        }, {
            "_id": 29,
            "attachments": [],
            "link": true,
            "mname": "Dashboard",
            "parrent": 19,
            "sequence": 29,
            "visible": true,
            "ancestors": [],
            "href": "Dashboard"
        }, {
            "_id": 42,
            "attachments": [],
            "link": true,
            "mname": "Employees",
            "parrent": 9,
            "sequence": 29,
            "visible": true,
            "ancestors": [],
            "href": "Employees"
        }, {
            "_id": 43,
            "attachments": [],
            "link": true,
            "mname": "Applications",
            "parrent": 9,
            "sequence": 30,
            "visible": true,
            "ancestors": [],
            "href": "Applications"
        }, {
            "_id": 14,
            "attachments": [],
            "link": true,
            "mname": "Job Positions",
            "parrent": 9,
            "sequence": 32,
            "visible": true,
            "ancestors": [],
            "href": "JobPositions"
        }, {
            "_id": 15,
            "attachments": [],
            "link": true,
            "mname": "Groups",
            "parrent": 1,
            "sequence": 33,
            "visible": true,
            "ancestors": [],
            "href": "Departments"
        }, {
            "_id": 7,
            "__v": 0,
            "attachments": [],
            "link": true,
            "mname": "Users",
            "parrent": 1,
            "sequence": 42,
            "visible": true,
            "ancestors": [],
            "href": "Users"
        }, {
            "_id": 44,
            "attachments": [],
            "link": true,
            "mname": "Workflows",
            "parrent": 1,
            "sequence": 44,
            "visible": true,
            "ancestors": [],
            "href": "Workflows"
        }, {
            "_id": 51,
            "attachments": [],
            "link": true,
            "mname": "Profiles",
            "parrent": 1,
            "sequence": 51,
            "visible": true,
            "ancestors": [],
            "href": "Profiles"
        }, {
            "_id": 52,
            "attachments": [],
            "link": true,
            "mname": "Birthdays",
            "parrent": 9,
            "sequence": 52,
            "visible": true,
            "ancestors": [],
            "href": "Birthdays"
        }, {
            "_id": 53,
            "attachments": [],
            "link": true,
            "mname": "Dashboard",
            "parrent": 36,
            "sequence": 53,
            "visible": true,
            "ancestors": [],
            "href": "projectDashboard"
        }, {
            "_id": 54,
            "mname": "Purchases",
            "sequence": 54,
            "parrent": null,
            "link": false,
            "visible": true,
            "ancestors": [],
            "href": "Purchases"
        }, {
            "_id": 80,
            "mname": "Jobs Dashboard",
            "sequence": 54,
            "parrent": 36,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "jobsDashboard"
        }, {
            "_id": 55,
            "mname": "Quotations",
            "sequence": 55,
            "parrent": 54,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Quotations"
        }, {
            "_id": 57,
            "mname": "Order",
            "sequence": 56,
            "parrent": 54,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Order"
        }, {
            "_id": 56,
            "mname": "Invoice",
            "sequence": 57,
            "parrent": 54,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Invoice"
        }, {
            "_id": 58,
            "mname": "Product",
            "sequence": 58,
            "parrent": 54,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Product"
        }, {
            "_id": 59,
            "mname": "Accounting",
            "sequence": 59,
            "parrent": null,
            "link": false,
            "visible": true,
            "ancestors": [],
            "href": "Accounting"
        }, {
            "_id": 60,
            "mname": "Supplier Payments",
            "sequence": 60,
            "parrent": 59,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "supplierPayments"
        }, {
            "_id": 61,
            "mname": "Customer Payments",
            "sequence": 61,
            "parrent": 59,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "customerPayments"
        }, {
            "_id": 62,
            "mname": "Quotations",
            "sequence": 62,
            "parrent": 19,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "salesQuotations"
        }, {
            "_id": 63,
            "mname": "Order",
            "sequence": 63,
            "parrent": 19,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "salesOrders"
        }, {
            "_id": 64,
            "mname": "Invoice",
            "sequence": 64,
            "parrent": 19,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "salesInvoices"
        }, {
            "_id": 68,
            "mname": "MonthHours",
            "sequence": 68,
            "parrent": 78,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "monthHours"
        }, {
            "_id": 69,
            "mname": "Holidays",
            "sequence": 69,
            "parrent": 78,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Holiday"
        }, {
            "_id": 77,
            "mname": "Capacity",
            "sequence": 69,
            "parrent": 9,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Capacity"
        }, {
            "_id": 88,
            "mname": "Salary Report",
            "sequence": 69,
            "parrent": 59,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "salaryReport"
        }, {
            "_id": 70,
            "mname": "Vacation",
            "sequence": 70,
            "parrent": 9,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Vacation"
        }, {
            "_id": 71,
            "mname": "Attendance",
            "sequence": 71,
            "parrent": 9,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Attendance"
        }, {
            "_id": 76,
            "mname": "Efficiency",
            "sequence": 72,
            "parrent": 78,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "Efficiency"
        }, {
            "_id": 72,
            "mname": "BonusType",
            "sequence": 73,
            "parrent": 78,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "bonusType"
        }, {
            "_id": 74,
            "mname": "HrDashboard",
            "sequence": 74,
            "parrent": 9,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "HrDashboard"
        }, {
            "_id": 66,
            "mname": "Payroll Expenses",
            "sequence": 77,
            "parrent": 78,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "PayrollExpenses"
        }, {
            "_id": 78,
            "mname": "Payroll",
            "sequence": 78,
            "parrent": null,
            "link": false,
            "visible": true,
            "ancestors": [],
            "href": "Payroll"
        }, {
            "_id": 79,
            "mname": "Payroll Payments",
            "sequence": 79,
            "parrent": 78,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "PayrollPayments"
        }, {
            "_id": 82,
            "mname": "Invoice Aging",
            "sequence": 82,
            "parrent": 59,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "invoiceAging"
        }, {
            "_id": 83,
            "mname": "ChartOfAccount",
            "sequence": 83,
            "parrent": 59,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "ChartOfAccount"
        }, {
            "_id": 85,
            "mname": "Journal",
            "sequence": 85,
            "parrent": 59,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "journal"
        }, {
            "_id": 86,
            "mname": "Journal Entry",
            "sequence": 86,
            "parrent": 59,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "journalEntry"
        }, {
            "_id": 87,
            "mname": "Invoice Charts",
            "sequence": 87,
            "parrent": 59,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "invoiceCharts"
        }, {
            "_id": 1,
            "__v": 0,
            "attachments": [],
            "link": false,
            "mname": "Settings",
            "parrent": null,
            "sequence": 1000,
            "visible": true,
            "ancestors": [],
            "href": "Settings"
        }, {
            "_id": 75,
            "mname": "tCard",
            "sequence": 1000,
            "parrent": 36,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "wTrack"
        }, {
            "_id": 84,
            "mname": "Categories",
            "sequence": 1000,
            "parrent": 1,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "productSettings"
        }, {
            "_id": 73,
            "mname": "DashBoardVacation",
            "sequence": 1001,
            "parrent": 36,
            "link": true,
            "visible": true,
            "ancestors": [],
            "href": "DashBoardVacation"
        }];
    var fakePayRollPayments = [
        {
            _id: "5731ecef00766a001927a457",
            month: 9,
            year: 2014,
            period: "2014-08-31T21:00:00.000Z",
            paymentRef: "56600af06226e3c43108cc2b",
            isExpense: true,
            differenceAmount: 0,
            workflow: "Draft",
            date: "2016-05-10T14:14:39.708Z",
            paidAmount: 110000,
            invoice: {
                _id: "5731ecef00766a001927a456",
                _type: "payRollInvoice",
                products: [
                    {
                        paid: 1100,
                        product: "56600af06226e3c43108cc2b"
                    }
                ],
                expense: true,
                editedBy: {
                    date: "2016-05-10T14:15:11.927Z",
                    user: null
                },
                createdBy: {
                    date: "2016-05-10T14:15:11.927Z",
                    user: null
                },
                creationDate: "2016-05-10T14:15:11.927Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                workflow: null,
                payments: [ ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 0,
                    balance: 0,
                    total: 0
                },
                paymentTerms: null,
                salesPerson: null,
                currency: {
                    rate: 1,
                    _id: null
                },
                journal: null,
                invoiceDate: "2016-05-10T14:15:11.926Z",
                paymentReference: "free",
                sourceDocument: null,
                supplier: null,
                forSales: true,
                name: "",
                __v: 0
            }
        },
        {
            _id: "5731ed0200766a001927a459",
            month: 1,
            year: 2015,
            period: "2014-12-31T22:00:00.000Z",
            paymentRef: "56600af06226e3c43108cc33",
            isExpense: true,
            differenceAmount: 0,
            workflow: "Draft",
            date: "2016-05-10T14:14:39.708Z",
            paidAmount: 30000,
            invoice: {
                _id: "5731ed0200766a001927a458",
                _type: "payRollInvoice",
                products: [
                    {
                        paid: 300,
                        product: "56600af06226e3c43108cc33"
                    }
                ],
                expense: true,
                editedBy: {
                    date: "2016-05-10T14:15:30.386Z",
                    user: null
                },
                createdBy: {
                    date: "2016-05-10T14:15:30.386Z",
                    user: null
                },
                creationDate: "2016-05-10T14:15:30.386Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                workflow: null,
                payments: [ ],
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 0,
                    balance: 0,
                    total: 0
                },
                paymentTerms: null,
                salesPerson: null,
                currency: {
                    rate: 1,
                    _id: null
                },
                journal: null,
                invoiceDate: "2016-05-10T14:15:30.385Z",
                paymentReference: "free",
                sourceDocument: null,
                supplier: null,
                forSales: true,
                name: "",
                __v: 0
            }
        }
    ];

    var payRollPaymentsCollection;
    var view;
    var topBarView;
    var listView;
    var formView;


    describe('PayRoll View', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
            topBarView.remove();
            //listView.remove();
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

                view = new MainView({el: $elFixture, contentType: 'PayrollPayments'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="79"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="79"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/PayrollPayments');

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

            it('Try to fetch collection with 401 error', function(){
                var payRollUrl = new RegExp('\/payment\/salary\/list', 'i');

                server.respondWith('GET', payRollUrl, [401, {"Content-Type": "application/json"}, JSON.stringify(fakePayRollPayments)]);
                payRollPaymentsCollection = new PayRollPaymentsCollection({
                    viewType: 'list',
                    page: 1,
                    contentType: 'PayrollPayments'
                });
                server.respond();
            });

            it('Try to create TopBarView', function () {
                var payRollUrl = new RegExp('\/payment\/salary\/list', 'i');
                var payRollTotal = new RegExp('\/payment\/salary\/totalCollectionLength', 'i');

                server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayRollPayments)]);
                server.respondWith('GET', payRollTotal, [200, {"Content-Type": "application/json"}, JSON.stringify({
                    count: 2
                })]);

                payRollPaymentsCollection = new PayRollPaymentsCollection({
                    viewType: 'list',
                    page: 1
                });

                server.respond();
                server.respond();

                topBarView = new TopBarView({
                    collection: payRollPaymentsCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });

        });

        describe('PayRoll list view', function () {
            var server;
            var windowConfirmStub;
            var clock;
            var mainSpy;
            var $thisEl;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                clock.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create bonusType list view', function (done) {
                    var payRollUrl = new RegExp('\/payment\/salary\/list', 'i');
                    var payRollTotal = new RegExp('\/payment\/salary\/totalCollectionLength', 'i');

                    server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayRollPayments)]);
                    server.respondWith('GET', payRollTotal, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    listView = new ListView({
                        collection: payRollPaymentsCollection,
                        startTime: new Date()
                    });
                    server.respond();
                    server.respond();

                    clock.tick(200);
                    $thisEl= listView.$el;

                    expect($thisEl.find('table')).to.exist;

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

                    payRollPaymentsCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to showMore collection with error', function(){
                    var spyResponse;
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var payRollUrl = new RegExp('\/payment\/salary\/list', 'i');

                    server.respondWith('GET', payRollUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakePayRollPayments)]);
                    $needBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');
                });

                it('Try to showMore collection', function(){
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var payRollUrl = new RegExp('\/payment\/salary\/list', 'i');
                    var payRollTotal = new RegExp('\/payment\/salary\/totalCollectionLength', 'i');

                    server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayRollPayments)]);
                    server.respondWith('GET', payRollTotal, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    $needBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('table')).to.exist;
                });

                it('Try to check|uncheck checkboxes', function(){
                    // all
                    var $checkAllBtn = listView.$el.find('#checkAll');

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.true;

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.false;
                });

                it('Try to sort list', function(){
                    var $paidSortBtn = $thisEl.find('.list  tr > th[data-sort="paidAmount"]');
                    var payRollUrl = new RegExp('\/payment\/salary\/list', 'i');
                    var payRollTotal = new RegExp('\/payment\/salary\/totalCollectionLength', 'i');

                    server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakePayRollPayments[1], fakePayRollPayments[0]])]);
                    server.respondWith('GET', payRollTotal, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    $paidSortBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('5731ed0200766a001927a459');

                    server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayRollPayments)]);
                    server.respondWith('GET', payRollTotal, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    $paidSortBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('5731ecef00766a001927a457');
                });

                it('Try to delete item', function(done){
                    var $deleteBtn;
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var payRollPayments = new RegExp('\/payment\/', 'i');
                    var payRollUrl = new RegExp('\/payment\/salary\/list', 'i');
                    var payRollTotal = new RegExp('\/payment\/salary\/totalCollectionLength', 'i');

                    $needCheckBox.click();
                    $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    server.respondWith('GET', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakePayRollPayments[1], fakePayRollPayments[0]])]);
                    server.respondWith('GET', payRollTotal, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        count: 2
                    })]);
                    server.respondWith('DELETE', payRollPayments, [200, {"Content-Type": "application/json"}, JSON.stringify({"success":"Done"})]);
                    $deleteBtn.click();
                    server.respond();

                    clock.tick(200);
                    server.respond();

                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('5731ed0200766a001927a459');
                    done();
                });

                it('Try to edit item', function () {
                    var $selEl;
                    var $statusInput = listView.$el.find('td a.currentSelected')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $datePicker = listView.$el.find('#payRoll-TableBody > tr#201409 > td.datePicker');
                    var payRollUrl = new RegExp('\/payroll\/byDataKey', 'i');

                    $datePicker.click();
                    $datePicker.find('input').val('01/04/2016');
                    $datePicker.trigger('change');

                    //$deleteBtn.click();

                    $statusInput.click();
                    $selEl = listView.$el.find('.newSelectList li')[1];
                    $selEl.click();
                    server.respondWith('PATCH', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        "success": {
                            "__v": 0,
                            "date": "2016-03-11T22:00:00.000Z",
                            "year": null,
                            "week": null,
                            "_id": "56e2cd4a3abb6ba70f73ad73"
                        }
                    })]);
                    $saveBtn.click();
                    server.respond();

                    expect($(listView.$el.find('td a')).attr('data-value')).to.be.equals('true');

                });

                it('Try to delete item', function () {
                    var $firstEl = listView.$el.find('#payRoll-TableBody > tr#201409 > td.notForm > input.totalRowCB');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var payRollUrl = new RegExp('\/payroll\/byDataKey', 'i');

                    windowConfirmStub.returns(true);

                    $firstEl.click();
                    server.respondWith('DELETE', payRollUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to open|close generate dialog', function(done){
                    var $cancelBtn;
                    var $generateBtn = topBarView.$el.find('#top-bar-generate');

                    $generateBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();
                    //expect($('.ui-dialog')).to.not.exist;

                    clock.tick(200);
                    done();
                });

                it('Try open generate form with existing month', function () {
                    var $generateFormBtn;
                    var $monthInput;
                    var $yearInput;
                    var spyResponse;
                    var $generateBtn = topBarView.$el.find('#top-bar-generate');
                    var keyDowmE = $.Event("keydown", { keyCode: 64 });
                    var keyUpE = $.Event("keyup", { keyCode: 64 });

                    $generateBtn.click();

                    $generateFormBtn = $('#generateBtn');
                    $monthInput = $('#month');
                    $yearInput = $('#year');

                    $monthInput.click();
                    $monthInput.val('26');
                    $monthInput.trigger('focusout');
                    $monthInput.click();
                    $monthInput.val('0');
                    $monthInput.trigger('focusout');

                    $yearInput.trigger(keyDowmE);
                    $yearInput.click();
                    $yearInput.val('201633');
                    $yearInput.trigger(keyUpE);
                    $yearInput.trigger('focusout');

                    server.respondWith('POST', '/payroll/generate/', [200, {"Content-Type": "application/json"}, 'Ok']);
                    $generateFormBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];

                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please, choose empty month!');
                });

                it('Try to generate payroll expense with error', function(){
                    var $monthInput = $('#month');
                    var $generateFormBtn = $('#generateBtn');
                    var spyResponse;

                    $monthInput.click();
                    $monthInput.val('5');
                    $monthInput.trigger('focusout');

                    server.respondWith('POST', '/payroll/generate/', [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $generateFormBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[2][0];

                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'error');
                });

                it('Try to set non existing month', function(){
                    var $monthInput = $('#month');
                    var $generateFormBtn = $('#generateBtn');
                    var keyDowmE = $.Event("keydown", { keyCode: 36 });

                    $monthInput.trigger(keyDowmE);
                    $monthInput.click();
                    $monthInput.val('5');
                    $monthInput.trigger('focusout');

                    server.respondWith('POST', '/payroll/generate/', [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $generateFormBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to go to form', function(){
                    var $trBtn = listView.$el.find('tr#201411');

                    $trBtn.click();

                    expect(window.location.hash).to.be.equals('#easyErp/PayrollExpenses/form/201411');
                });

            });
        });
    });

});
*/
