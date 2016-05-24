define([
    'text!fixtures/index.html',
    'views/main/MainView',
    'views/settingsEmployee/index',
    'views/settingsEmployee/TopBarView',
    'views/weeklyScheduler/list/ListView',
    'views/payrollComponentTypes/list/ListView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (fixtures, MainView, IndexView, TopBarView, ScheduleListView, PayrollComponentTypeListView, $, chai, chaiJquery, sinonChai) {
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
    var fakeSchedule = [
        {
            1: 8,
            2: 8,
            3: 8,
            4: 8,
            5: 8,
            6: 0,
            7: 0,
            _id: "57332c3b94ee1140b6bb49e2",
            totalHours: 40,
            name: "UA-40"
        },
        {
            1: 4,
            2: 4,
            3: 4,
            4: 4,
            5: 4,
            6: 0,
            7: 0,
            _id: "573add0245310a4662c8005b",
            __v: 0,
            totalHours: 20,
            name: "UA-20"
        },
        {
            1: 8,
            2: 8,
            3: 8,
            4: 8,
            5: 4,
            6: 0,
            7: 0,
            _id: "573add2c0ed334e3619d2c2b",
            __v: 0,
            totalHours: 36,
            name: "Ger-36"
        }
    ];
    var fakeEarning = [
        {
            _id: "573edafcf9281fb40d5db50a",
            __v: 0,
            description: "fff",
            type: "earnings",
            name: "fff"
        }
    ];
    var fakeDeductions = [
        {
            _id: "5742ee217afe352f10c11c3b",
            __v: 0,
            description: "asdsd",
            type: "deductions",
            name: "sdsa"
        }
    ];

    var view;
    var topBarView;
    var indexView;

    describe('SettingsEmployee', function () {

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
                view = new MainView({el: $elFixture, contentType: 'settingsEmployee'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="103"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="103"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/settingsEmployee');
            });

        });

        describe('TopBarView', function () {

            it('Try to create TopBarView', function(){
                topBarView = new TopBarView({
                    actionType: 'Content'
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('settingsEmployee');
            });
        });

        describe('CloseMonthView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var deleteScheduleSpy;
            var deletePayrollSpy;
            var alertStub;

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
                deleteScheduleSpy = sinon.spy(ScheduleListView.prototype, 'remove');
                deletePayrollSpy = sinon.spy(PayrollComponentTypeListView.prototype, 'remove');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                deleteScheduleSpy.restore();
                alertStub.restore();
                deletePayrollSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create CloseMonthListView', function (done) {
                    var weekScheduleUrl = new RegExp('\/weeklyScheduler\/list', 'i');
                    var earningUrl = '/payrollComponentTypes/list/?count=100&type=earnings';
                    var deductionsUrl = '/payrollComponentTypes/list/?count=100&type=deductions';

                    server.respondWith('GET', weekScheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSchedule)]);
                    server.respondWith('GET', earningUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('GET', deductionsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    indexView = new IndexView({
                        startTime: new Date()
                    });
                    server.respond();
                    clock.tick(300);

                    $thisEl = indexView.$el;

                    expect($thisEl.find('#weeklyScheduler')).to.exist;
                    expect($thisEl.find('#earningType')).to.exist;
                    expect($thisEl.find('#deductionType')).to.exist;

                    done();
                });

                it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#weeklyScheduler tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to edit item', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#weeklySchedulerName > input');
                    var $mondayInput = $dialog.find('td[data-content="1"] > input');
                    var $saveBtn = $dialog.find('#create-weeklyScheduler-dialog');
                    var keyUpEvent = $.Event('keyup');
                    var scheduleUrl = new RegExp('weeklyScheduler\/', 'i');
                    var weekScheduleUrl = new RegExp('\/weeklyScheduler\/list', 'i');
                    var spyResponse;

                    $nameInput.val('');
                    $mondayInput.val('3');
                    $mondayInput.trigger(keyUpEvent);

                    //save with empty name
                    $saveBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');

                    //save with hours > 24
                    $nameInput.val('Test');
                    $mondayInput.val('25');
                    $saveBtn.click();
                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'hours should be in 0-24 range');

                    //save with error response
                    $mondayInput.val('3');
                    server.respondWith('PATCH', scheduleUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    server.respondWith('GET', weekScheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSchedule)]);
                    server.respondWith('PATCH', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":8,"2":8,"3":8,"4":8,"5":8,"6":0,"7":0,"_id":"57332c3b94ee1140b6bb49e2","totalHours":40,"name":"UA-40"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#weeklyScheduler tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete schedule item', function(){
                    var $deleteBtn = $thisEl.find('.fa-trash-o').eq(1);
                    var scheduleUrl = new RegExp('\/weeklyScheduler\/', 'i');

                    server.respondWith('DELETE', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":4,"2":4,"3":4,"4":4,"5":4,"6":0,"7":0,"_id":"573add0245310a4662c8005b","__v":0,"totalHours":20,"name":"UA-20"})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteScheduleSpy.calledOnce).to.be.true;
                });

                it('Try to create schedule item', function(){
                    mainSpy.reset();

                    var $createBtn = $thisEl.find('#weeklyScheduler .fa-plus');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#weeklySchedulerName > input');
                    var $mondayInput = $dialog.find('td[data-content="1"] > input');
                    var $saveBtn = $dialog.find('#create-weeklyScheduler-dialog');
                    var keyUpEvent = $.Event('keyup');
                    var scheduleUrl = 'weeklyScheduler';
                    var weekScheduleUrl = new RegExp('\/weeklyScheduler\/list', 'i');
                    var spyResponse;

                    $nameInput.val('');
                    $mondayInput.val('3');
                    $mondayInput.trigger(keyUpEvent);

                    //save with empty name
                    $saveBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');

                    //save with hours > 24
                    $nameInput.val('Test');
                    $mondayInput.val('25');
                    $saveBtn.click();
                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'hours should be in 0-24 range');

                    $mondayInput.val('3');
                    server.respondWith('GET', weekScheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSchedule)]);
                    server.respondWith('POST', scheduleUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"__v":0,"_id":"573f35b5a7312792307f9e50","totalHours":0,"name":"sf"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#weeklyScheduler .fa-plus');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                // payRollEarning views testing
                it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#listTableearnings > tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save payroll earning with empty name', function(){
                    mainSpy.reset();

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $nameInput.val('');
                    $saveBtn.click();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try to save model with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('PATCH', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save model with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('PATCH', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"573edafcf9281fb40d5db50a","__v":0,"description":"fff","type":"earnings","name":"ffff"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#listTableearnings > tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to remove Payroll earning type item', function(){
                    var $deleteBtn = $thisEl.find('#earningType .fa-trash-o');
                    var deleteUrl = new RegExp('\/payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('DELETE', deleteUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        _id: "573edafcf9281fb40d5db50a",
                        __v: 0,
                        description: "fff",
                        type: "earnings",
                        name: "fff"
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(deletePayrollSpy.calledOnce).to.be.true;
                });

                it('Try to open CreateDialog', function(){
                    var $createBtn = $thisEl.find('#earningType #top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create PayRollEarning Type item with empty name', function(){
                    mainSpy.reset();

                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $createBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try create item with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('\/payrollComponentTypes', 'i');

                    $nameInput.val('Test');

                    server.respondWith('POST', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $createBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create item with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('payrollComponentTypes', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEarning)]);
                    server.respondWith('POST', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"__v":0,"_id":"5742ecdf7afe352f10c11c3a","description":"Test test","type":"earnings","name":"TestName"})]);
                    $createBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#earningType #top-bar-createBtn');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });

                // payRollDeduction views testing
                it('Try to go to EditDialog', function(){
                    var $needTd = $thisEl.find('#listTabledeductions > tr:nth-child(1) > td:nth-child(2)');

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save payroll deduction with empty name', function(){
                    mainSpy.reset();

                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $nameInput.val('');
                    $saveBtn.click();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try to save model with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('PATCH', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    //expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to save model with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var $saveBtn = $('#create-weeklyScheduler-dialog');
                    var patchUrl = new RegExp('payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=deductions';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('PATCH', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"5742ee217afe352f10c11c3b","__v":0,"description":"asdsd","type":"deductions","name":"sdsa"})]);
                    $saveBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel EditDialog', function(){
                    var $needTd = $thisEl.find('#listTabledeductions > tr:nth-child(1) > td:nth-child(2)');
                    var $cancelBtn;

                    $needTd.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to remove Payroll deduction type item', function(){
                    var $deleteBtn = $thisEl.find('#deductionType .fa-trash-o');
                    var deleteUrl = new RegExp('\/payrollComponentTypes\/', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=earnings';

                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('DELETE', deleteUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"_id":"5742ee217afe352f10c11c3b","__v":0,"description":"asdsd","type":"deductions","name":"sdsa"})]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(deletePayrollSpy.calledTwice).to.be.true;
                });

                it('Try to open CreateDialog', function(){
                    var $createBtn = $thisEl.find('#deductionType #top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to create PayRollDeduction Type item with empty name', function(){
                    mainSpy.reset();

                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var spyResponse;

                    $createBtn.click();
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'name can\'t be empty');
                });

                it('Try create item with error response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('\/payrollComponentTypes\/', 'i');

                    $nameInput.val('Test');

                    server.respondWith('POST', patchUrl, [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $createBtn.click();
                    server.respond();

                    //expect($('.ui-dialog')).to.be.exist;
                });


                it('Try to create item with good response', function(){
                    var $dialog = $('.ui-dialog');
                    var $createBtn = $('#create-weeklyScheduler-dialog');
                    var $nameInput = $dialog.find('#payrollComponentTypeName');
                    var patchUrl = new RegExp('payrollComponentTypes', 'i');
                    var earningsUrl = '/payrollComponentTypes/list/?count=100&type=deductions';

                    $nameInput.val('Test');
                    server.respondWith('GET', earningsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDeductions)]);
                    server.respondWith('POST', patchUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({"__v":0,"_id":"5742ef4d7afe352f10c11c3c","description":"Test","type":"deductions","name":"TestName"})]);
                    $createBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to cancel CreateDialog', function(){
                    var $createBtn = $thisEl.find('#deductionType #top-bar-createBtn');
                    var $cancelBtn;

                    $createBtn.click();
                    expect($('.ui-dialog')).to.be.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });
            });
        });
    });
});