define([
    'modules',
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
], function (modules, fixtures, MainView, IndexView, TopBarView, ScheduleListView, PayrollComponentTypeListView, $, chai, chaiJquery, sinonChai) {
    'use strict';

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
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

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

                server.respondWith('GET', '/modules/', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
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
                expect(topBarView.$el.find('h3').text()).to.be.equals('Employees');
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