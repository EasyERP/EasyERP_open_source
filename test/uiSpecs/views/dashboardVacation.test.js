define([
    'Underscore',
    'modules',
    'dashboardVacation',
    'text!fixtures/index.html',
    'collections/Dashboard/vacationDashboard',
    'views/main/MainView',
    'views/vacationDashboard/index',
    'views/vacationDashboard/TopBarView',
    'views/vacationDashboard/statisticsView',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'constants/filters'
], function (_,
             modules,
             DashboardVacation,
             fixtures,
             DashBoardVacationCollection,
             MainView,
             IndexView,
             TopBarView,
             StatisticsView,
             FilterView,
             FilterGroup,
             SavedFilters,
             $,
             chai,
             chaiJquery,
             sinonChai,
             FILTER_CONSTANTS) {
    'use strict';

    var expect;
    var view;
    var topBarView;
    var indexView;
    var selectSpy;
    var removeFilterSpy;
    var saveFilterSpy;
    var removedFromDBSpy;
    var debounceStub;
    var ajaxSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('DashboardVacation', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            ajaxSpy = sinon.spy($, 'ajax');
            selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(SavedFilters.prototype, 'saveFilter');
            removedFromDBSpy = sinon.spy(SavedFilters.prototype, 'removeFilterFromDB');
            debounceStub = sinon.stub(_, 'debounce', function (debFunction) {
                return debFunction;
            });
        });

        after(function () {
            view.remove();
            topBarView.remove();
            indexView.remove();

            ajaxSpy.restore();
            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
            removedFromDBSpy.restore();
            debounceStub.restore();
        });

        describe('#initialize()', function () {
            var server;
            var clock;

            before(function () {
                $fixture = $(fixtures);
                $fixture.appendTo(document.body);
                $elFixture = $fixture.find('#wrapper');

                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            it('Should create main view', function () {
                var $expectedSubMenuEl;
                var $expectedMenuEl;

                server.respondWith('GET', '/modules/', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);
                view = new MainView({el: $elFixture, contentType: 'DashBoardVacation'});
                server.respond();

                clock.tick(1000);

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="73"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="73"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/DashBoardVacation');

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

            it('Try to create TopBarView', function () {
                topBarView = new TopBarView({});

                expect(topBarView.$el.find('.vocationFilter')).to.exist;
                expect(topBarView.$el.find('#searchContainer')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dashboard');
            });
        });

        describe('DashBoard IndexView', function () {
            var customerImagesUrl = new RegExp('\/customers\/getCustomersImages', 'i');
            var wTrackUrl = new RegExp('\/wTrack\/', 'i');
            var jobsUrl = new RegExp('\/jobs\/', 'i');
            var jobsDDUrl = new RegExp('\/jobs\/getForDD', 'i');
            var server;
            var depOpenSpy;
            var devOpenSpy;
            var createWTrackSpy;
            var clock;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                depOpenSpy = sinon.spy(IndexView.prototype, 'openDepartment');
                devOpenSpy = sinon.spy(IndexView.prototype, 'openEmployee');
                mainSpy = sinon.spy(App, 'render');
                createWTrackSpy = sinon.spy(IndexView.prototype, 'createWTrack');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                depOpenSpy.restore();
                devOpenSpy.restore();
                createWTrackSpy.restore();
                clock.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {
                var $thisEl;

                it('Try to create Dashboard list view', function (done) {
                    var dashBoardUrl = new RegExp('dashboard\/vacation', 'i');
                    var filtersUrl = new RegExp('\/filter\/DashVacation');

                    this.timeout(25000);

                    server.respondWith('GET', dashBoardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(DashboardVacation.fakeDashboardVacation)]);
                    server.respondWith('GET', filtersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(DashboardVacation.fakeFilters)]);
                    indexView = new IndexView({
                        startTime: new Date()
                    });

                    server.respond();
                    clock.tick(24000);
                    $thisEl = indexView.$el;

                    expect($thisEl.find('.dashBoardMargin')).to.exist;

                    done();
                });

                it('Try to expand all', function (done) {
                    var $expandAllBtn = indexView.$el.find('.openAll');

                    this.timeout(20000);

                    $expandAllBtn.click();
                    expect($thisEl.find('#dashboardBody > tr:nth-child(3)').attr('data-content')).to.be.equals('project');
                    clock.tick(9000);

                    $expandAllBtn.click();
                    clock.tick(9000);

                    done();
                });

                it('Try to open web department', function (done) {
                    var $webDepartmentRow = $thisEl.find('#dashboardBody > tr:nth-child(1) > td:nth-child(2)');

                    this.timeout(20000);

                    $webDepartmentRow.click();
                    expect(depOpenSpy.called).to.be.true;
                    clock.tick(9000);

                    $webDepartmentRow.click();
                    expect(depOpenSpy.calledTwice).to.be.true;
                    clock.tick(9000);

                    done();
                });

                it('Try to open and close change range dialog', function () {
                    var $cancelBtn;
                    var $dateRangeEl = topBarView.$el.find('li.dateRange');

                    $dateRangeEl.click();

                    $cancelBtn = topBarView.$el.find('#cancelBtn');
                    $cancelBtn.click();
                });

                it('Try to change date range in TopBarView', function (done) {
                    var $startDateInput;
                    var $endDateInput;
                    var $updateBtn;
                    var $dateRangeEl = topBarView.$el.find('li.dateRange');
                    var dashBoardUrl = new RegExp('dashboard\/vacation', 'i');

                    this.timeout(20000);

                    $dateRangeEl.click();

                    $startDateInput = topBarView.$el.find('#startDate');
                    $endDateInput = topBarView.$el.find('#endDate');

                    $startDateInput.click();
                    $startDateInput.val('28 Mar, 2016');
                    $endDateInput.val('29 May, 2016');

                    $updateBtn = topBarView.$el.find('#updateDate');

                    server.respondWith('GET', dashBoardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(DashboardVacation.fakeDashboardVacation)]);
                    $updateBtn.click();
                    indexView.changeDateRange();
                    server.respond();

                    clock.tick(19000);

                    expect($thisEl.find('.dashBoardMargin')).to.exist;

                    done();
                });

                it('Try to open tCard CreateView', function (done) {
                    var $projectsRow;
                    var $createWTrack;
                    var $needEmployeeRow = indexView.$el.find('#dashboardBody > tr[data-id="55b92ad221e4b7c40f00004d"] .employeesRow');
                    var projectsUrl = new RegExp('\/projects\/getForWtrack', 'i');
                    var vacationUrl = new RegExp('\/vacation\/', 'i');
                    var holidayUrl = new RegExp('\/holiday\/', 'i');

                    this.timeout(10000);

                    $needEmployeeRow.click();
                    clock.tick(4000);
                    expect(devOpenSpy.called).to.be.true;

                    $projectsRow = $needEmployeeRow.closest('tr').next();

                    $createWTrack = $projectsRow.find('td.createTd').first();

                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(DashboardVacation.fakeProjectWTrack)]);
                    server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    server.respondWith('GET', holidayUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $createWTrack.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                    expect(createWTrackSpy.called).to.be.true;
                    done();
                });

                it('Try to edit createView tCard', function () {
                    var $needLiEl;
                    var $chooseGroupBtn;
                    var $select;
                    var $jobsTd;
                    var generateJob;
                    var $dialogEl = $('.ui-dialog');
                    var $row = $dialogEl.find('#wTrackCreateTable tr:nth-child(1)');
                    var $typeTcard = $dialogEl.find('#wTrackCreateTable td:nth-child(1)');
                    var $mondayTd = $dialogEl.find('#wTrackCreateTable td:nth-child(9)');
                    var $sundayTd = $dialogEl.find('#wTrackCreateTable td:nth-child(15)');
                    var $jobsTd = $dialogEl.find('td[data-content="jobs"]');
                    var $weekTd = $dialogEl.find('td[data-content="week"]');
                    var $project = $dialogEl.find('#project');
                    var keyDownEvent = $.Event('keydown');
                    var keyDownEventLetter = $.Event('keydown', {keyCode: 69});
                    var keyUpEvent = $.Event('keyup');
                    var $editInput;
                    var spyResponse;

                    this.timeout(4000);
                    $project.click();
                    //try to edit job without select Project
                    $jobsTd.click();
                    expect(mainSpy.calledOnce).to.be.true;
                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please, choose project first.');

                    // select Project
                    $select = $dialogEl.find('#56e689c75ec71b00429745a9');
                    server.respondWith('GET', jobsDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsForProject)]);
                    server.respondWith('GET', customerImagesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerImage)]);
                    $select.click();
                    server.respond();
                    server.respond();

                    // try to edit input with letter
                    $mondayTd.click();
                    $editInput = $mondayTd.find('input');
                    $editInput.val('');
                    $editInput.trigger(keyDownEventLetter);
                    expect($editInput.val()).to.be.equal('');
                    //try to edit days of week in OR

                    $mondayTd.click();
                    $editInput = $mondayTd.find('input');
                    $editInput.trigger(keyDownEvent);
                    $editInput.val('9');
                    $editInput.trigger(keyUpEvent);
                    $editInput.trigger('change');
                    expect(mainSpy.calledTwice).to.be.true;
                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Сreate Overtime tCard for input more than 8 hours');
                    expect($editInput.val()).to.be.equal('8');

                    $sundayTd.click();
                    expect(mainSpy.calledThrice).to.be.true;
                    spyResponse = mainSpy.args[2][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please create Overtime tCard');

                    // try to change type of tCard to overtime
                    $typeTcard.click();
                    $select = $dialogEl.find('ul.newSelectList > li:nth-child(2)');
                    $select.click();
                    expect($row).to.have.class('overtime');

                    //try to edit days of week in OT

                    $mondayTd.click();
                    $editInput = $mondayTd.find('input');
                    $editInput.trigger(keyDownEvent);
                    $editInput.val('9');
                    $editInput.trigger(keyUpEvent);
                    $editInput.trigger('change');
                    expect($editInput.val()).to.be.equal('9');

                    //try to removeInputs
                    $weekTd.click();
                    expect($dialogEl.find('input').length).to.be.equal(0);


                    //  $chooseGroupBtn.click();

                    //expect($('.ui-dialog')).to.not.exist;

                });

                it('Try to generate Job in createView wTrack', function (done) {
                    var $generateJob;
                    var $dialogEl = $('.ui-dialog');
                    var $jobsTd;
                    var $nameInput;
                    var $saveButton;

                    $jobsTd = $dialogEl.find('td[data-id="56e6f1ae0d773c634e918b68"]');

                    // generate Job
                    // server.respondWith('GET', jobsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsForProject)]);
                    $jobsTd.click();
                    server.respond();
                    $generateJob = $dialogEl.find('#createJob');
                    $generateJob.click();
                    $dialogEl = $('.ui-dialog').last();
                    $nameInput = $dialogEl.find('#jobName');
                    $nameInput.val('new Test job');
                    $saveButton = $dialogEl.find('#generateBtn');
                    server.respondWith('POST', jobsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveButton.click();
                    server.respond();
                    done();
                });


                it('Try to save tCard in editView with error', function (done) {
                    var $dialogEl = $('.ui-dialog');
                    var $saveButton = $dialogEl.find('div.ui-dialog-buttonpane button:nth-child(1)');

                    // generate Job
                    server.respondWith('POST', wTrackUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveButton.click();
                    server.respond();
                    done();
                    expect($dialogEl).to.exist;
                });

                it('Try to save tCard in createView', function (done) {
                    var $dialogEl = $('.ui-dialog');
                    var $saveButton = $dialogEl.find('div.ui-dialog-buttonpane button:nth-child(1)');

                    // generate Job
                    server.respondWith('POST', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveButton.click();
                    server.respond();
                    done();
                    expect($dialogEl).to.not.exist;
                });


                it('Try to get Wtrack Info with error', function (done) {
                    var wTrackUrl = new RegExp('\/wTrack\/dash', 'i');
                    var $needEmployeeRow = indexView.$el.find('#dashboardBody > tr[data-id="55b92ad221e4b7c40f00004d"] .employeesRow');
                    var vacationUrl = new RegExp('\/vacation\/', 'i');
                    var holidayUrl = new RegExp('\/holiday\/', 'i');
                    var $wTrackInfoEl;
                    var $projectsRow;
                    var spyResponse;

                    this.timeout(5000);

                    // close employee
                    $needEmployeeRow.click();
                    expect(devOpenSpy.calledTwice).to.be.true;

                    // open employee
                    $needEmployeeRow.click();
                    expect(devOpenSpy.calledThrice).to.be.true;


                    $projectsRow = $needEmployeeRow.closest('tr').next().next();

                    $wTrackInfoEl = $projectsRow.find('td').eq(1).find('span').first();
                    server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    server.respondWith('GET', holidayUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    server.respondWith('GET', wTrackUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeWTrackDash)]);
                    $wTrackInfoEl.click();
                    server.respond();
                    server.respond();
                    server.respond();
                    expect(mainSpy.callCount).to.be.equals(5);
                    spyResponse = mainSpy.args[4][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Bad Request');

                    done();
                });

                it('Try to get Wtrack Info', function () {
                    var wTrackUrl = new RegExp('\/wTrack\/dash', 'i');
                    var $needEmployeeRow = indexView.$el.find('#dashboardBody > tr[data-id="55b92ad221e4b7c40f00004d"] .employeesRow');
                    var vacationUrl = new RegExp('\/vacation\/', 'i');
                    var holidayUrl = new RegExp('\/holiday\/', 'i');
                    var $wTrackInfoEl;
                    var $projectsRow;

                    this.timeout(5000);

                    // close employee
                    $needEmployeeRow.click();
                    expect(devOpenSpy.callCount).to.be.equal(4);

                    // open employee
                    $needEmployeeRow.click();
                    expect(devOpenSpy.callCount).to.be.equal(5);


                    $projectsRow = $needEmployeeRow.closest('tr').next().next();

                    $wTrackInfoEl = $projectsRow.find('td').eq(1).find('span').first();

                    server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        3: "H"
                    })]);
                    server.respondWith('GET', holidayUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        3: null,
                        4: "V",
                        5: "V"
                    })]);
                    server.respondWith('GET', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWTrackDash)]);
                    server.respondWith('GET', customerImagesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerImage)]);
                    $wTrackInfoEl.click();
                    server.respond();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to edit wTrackInfo', function () {
                    var $saveBtn;
                    var $wTrackInfoEl = $(indexView.$el.find('#dashboardBody > tr[data-employee="55b92ad221e4b7c40f00004d"] > td.wTrackInfo')[0]);

                    var $needLiEl;
                    var $chooseGroupBtn;
                    var $select;
                    var $jobsTd;
                    var generateJob;


                    var $dialogEl = $('.ui-dialog');
                    var $row = $dialogEl.find('tr:nth-child(1)');
                    var $typeTcard = $dialogEl.find('td:nth-child(1)');
                    var $mondayTd = $dialogEl.find('td:nth-child(9)');
                    var $wednesdayHolidayTd = $dialogEl.find('td:nth-child(11)');
                    var $thursdayVacationTd = $dialogEl.find('td:nth-child(12)');
                    var $sundayTd = $dialogEl.find('td:nth-child(15)');
                    var $worked = $dialogEl.find('td[data-content="worked"]');
                    var $jobsTd = $dialogEl.find('td[data-content="jobs"]');
                    var $weekTd = $dialogEl.find('td[data-content="week"]');
                    var $project = $dialogEl.find('#project');
                    var keyDownEvent = $.Event('keydown');
                    var keyDownEventLetter = $.Event('keydown', {keyCode: 69});
                    var keyDownEventEnter = $.Event('keydown', {keyCode: 13});
                    var keyUpEvent = $.Event('keyup');
                    var $editInput;
                    var spyResponse;

                    this.timeout(4000);

                    // try to edit input with letter
                    $mondayTd.click();
                    $editInput = $mondayTd.find('input');
                    $editInput.val('');
                    $editInput.trigger(keyDownEventLetter);
                    expect($editInput.val()).to.be.equal('');

                    //try to edit days of week in OR

                    $mondayTd.click();
                    $editInput = $mondayTd.find('input');
                    $editInput.trigger(keyDownEvent);
                    $editInput.val('9');
                    $editInput.trigger(keyUpEvent);
                    $editInput.trigger('change');
                    expect(mainSpy.callCount).to.be.equal(6);
                    spyResponse = mainSpy.args[5][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Сreate Overtime tCard for input more than 8 hours');
                    expect($editInput.val()).to.be.equal('8');

                    $sundayTd.click();
                    expect(mainSpy.callCount).to.be.equal(7);
                    spyResponse = mainSpy.args[6][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please create Overtime tCard');

                    //try to edit vacations and holidays in OR

                    $wednesdayHolidayTd.click();
                    expect(mainSpy.callCount).to.be.equal(8);
                    spyResponse = mainSpy.args[7][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please create Overtime tCard');
                    expect($editInput.val()).to.be.equal('8');

                    $thursdayVacationTd.click();
                    expect(mainSpy.callCount).to.be.equal(9);
                    spyResponse = mainSpy.args[8][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please create Overtime tCard');

                    // try to change type of tCard to overtime
                    $typeTcard.click();
                    $select = $dialogEl.find('ul.newSelectList > li:nth-child(2)');
                    $select.click();
                    expect($row).to.have.class('overtime');

                    //try to edit working days in OT

                    $mondayTd.click();
                    $editInput = $mondayTd.find('input');
                    $editInput.trigger(keyDownEvent);
                    $editInput.val('9');
                    $editInput.trigger(keyUpEvent);
                    $editInput.trigger('change');
                    expect($editInput.val()).to.be.equal('9');

                    // try to edit vacations,holidays and weekends in OT

                    $wednesdayHolidayTd.click();
                    $editInput = $wednesdayHolidayTd.find('input');

                    $editInput.val(25);
                    $editInput.trigger(keyDownEvent);
                    $editInput.trigger(keyUpEvent);
                    $editInput.trigger('change');
                    expect($editInput.val()).to.be.equal('24');


                    $thursdayVacationTd.click();
                    $editInput = $thursdayVacationTd.find('input');
                    $editInput.val(9);
                    $editInput.trigger(keyDownEventEnter);
                    $editInput.trigger(keyUpEvent);
                    $editInput.trigger('change');
                    expect($editInput.val()).to.be.equal('9');

                    $sundayTd.click();
                    $editInput = $sundayTd.find('input');
                    $editInput.trigger(keyDownEvent);
                    $editInput.val(9);
                    $editInput.trigger(keyUpEvent);
                    $editInput.trigger('change');
                    expect($editInput.val()).to.be.equal('9');
                    //try to removeInputs
                    $weekTd.click();
                    expect($dialogEl.find('input').length).to.be.equal(0);
                    expect($worked.text()).to.be.equal('58');

                    // expect($wTrackInfoEl.find('.projectHours').text()).to.be.equals('39');
                    // $('.ui-dialog').remove();
                });

                it('Try to open Job Generate View in editView wTrack', function (done) {
                    var $generateJob;
                    var $dialogEl = $('.ui-dialog');
                    var $jobsTd;
                    var $nameInput;
                    var $cancelButton;

                    $jobsTd = $dialogEl.find('td[data-id="564cfd8ba6e6390160c9ef57"]');

                    // generate Job
                    server.respondWith('GET', jobsDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(DashboardVacation.fakeJobsForProject)]);
                    $jobsTd.click();
                    server.respond();
                    $generateJob = $dialogEl.find('#createJob');
                    $generateJob.click();
                    $dialogEl = $('.ui-dialog').last();
                    $nameInput = $dialogEl.find('#jobName');
                    $nameInput.val('new Test job');
                    $cancelButton = $dialogEl.find('#cancelBtn');
                    $cancelButton.click();
                    done();
                });

                it('Try to save tCard in editView with error', function (done) {
                    var $dialogEl = $('.ui-dialog');
                    var $saveButton = $('div.ui-dialog-buttonpane button:nth-child(1)');

                    // generate Job
                    server.respondWith('PATCH', wTrackUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveButton.click();
                    server.respond();
                    done();
                    expect($dialogEl).to.exist;
                });

                it('Try to save tCard in editView success', function (done) {
                    var $dialogEl = $('.ui-dialog');
                    var $saveButton = $('div.ui-dialog-buttonpane button:nth-child(1)');

                    // generate Job
                    server.respondWith('PATCH', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveButton.click();
                    server.respond();
                    done();
                    expect($dialogEl).to.not.exist;
                });
            });
        });
    });
});
