define([
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'modules',
    'text!fixtures/index.html',
    'models/ProjectsModel',
    'collections/Projects/filterCollection',
    'views/main/MainView',
    'views/Projects/TopBarView',
    'views/Projects/thumbnails/ThumbnailsView',
    'helpers/eventsBinder',
    'testConstants/projects',
    'views/Projects/list/ListView',
     'views/Projects/form/FormView',
     'views/Projects/CreateView',
     'views/Projects/EditView',
     'custom',
     'async'
], function ($, chai, chaiJquery, sinonChai, modules, fixtures, ProjectModel, ProjectCollection, MainView, topBarView, ThumbnailsView, eventsBinder, PROJECTS, ListView, FormView, CreateView, EditView, custom, async) {
    'use strict';

    var view;
    var topBarView;
    var listView;
    var thumbnailsView;
    var createView;
    var formView;
    var projectsCollection;
    var projectsThumbCollection;
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('ProjectsView', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            topBarView.remove();
            thumbnailsView.remove();
            formView.remove();
           /*  listView.remove();*/
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

                server.respondWith('GET', '/getModules', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'Projects'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="39"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="39"]').closest('li');

                $needAEl.click();
                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Projects');
            });

        });

        describe('topBarView', function () {
            var clock = sinon.useFakeTimers();
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create topBarView', function () {
                var projectsUrl = new RegExp('\/Projects\/list', 'i');

                server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeProjects)]);
                projectsCollection = new ProjectCollection({
                    viewType   : 'list',
                    contentType: 'Projects'
                });
                server.respond();

                topBarView = new topBarView({
                    collection: projectsCollection,
                    actionType: 'Content'
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Projects');
            });

            it('Try to change ContentTypeView', function () {
                var $listBtn = topBarView.$el.find('#listBtn');
                var $thumbnailsBtn = topBarView.$el.find('#thumbBtn');

                $thumbnailsBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Projects/thumbnails');

                $listBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Projects/list');
            });

        });

        describe('ThumbnailsView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var $thisEl;
            var clock;

            before(function () {
                window.location.hash = '#easyErp/Projects/thumbnails';
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ThumbnailsView', function (done) {
                    var projectsUrl = new RegExp('\/projects\/', 'i');
                    var worlflowUrl = new RegExp('\/Workflows', 'i');
                    var $thumbnailsContainer;
                    var $thumbnails;
                    var $firstThumbnail;
                    var projectName;
                    var customerName;
                    var $health;
                    var $stageSelect;
                    var $showMoreBtn;

                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeProjectsForThumbnails)]);
                    projectsThumbCollection = new ProjectCollection({
                        viewType   : 'thumbnails',
                        reset      : true,
                        count      : 3,
                        contentType: 'Projects'
                    });

                    server.respond();

                    expect(projectsThumbCollection)
                        .to.have.lengthOf(3);

                    server.respondWith('GET', worlflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeWorkflows)]);
                    thumbnailsView = new ThumbnailsView({
                        startTime : new Date(),
                        collection: projectsThumbCollection
                    });

                    server.respond();

                    eventsBinder.subscribeTopBarEvents(topBarView, thumbnailsView);
                    eventsBinder.subscribeCollectionEvents(projectsThumbCollection, thumbnailsView);

                    projectsThumbCollection.trigger('fetchFinished', {
                        totalRecords: projectsThumbCollection.totalRecords,
                        currentPage : projectsThumbCollection.currentPage,
                        pageSize    : projectsThumbCollection.pageSize
                    });

                    $thisEl = thumbnailsView.$el;

                    $thumbnailsContainer = $thisEl.find('#thumbnailContent');
                    $thumbnails = $thumbnailsContainer.find('.thumbnail');

                    expect($thumbnailsContainer).to.exist;
                    expect($thumbnails).to.have.lengthOf(3);

                    $firstThumbnail = $($thumbnails[0]);
                    projectName = $firstThumbnail.find('span[data-content="project"]').text();
                    customerName = $firstThumbnail.find('span[data-content="customer"]').text();
                    $health = $firstThumbnail.find('span.health-container a');
                    $stageSelect = $firstThumbnail.find('a.stageSelect');

                    expect(projectName).not.to.be.empty;
                    expect(customerName).not.to.be.empty;
                    expect(projectName).to.not.match(/object Object|undefined/);
                    expect(customerName).to.not.match(/object Object|undefined/);
                    expect($health).to.exist;
                    expect($health)
                        .to.have.attr('data-value')
                        .and.not.be.empty;

                    expect($stageSelect).to.exist;
                    expect($stageSelect.text())
                        .not.to.be.empty
                        .and.not.to.match(/object Object|undefined/);

                    $showMoreBtn = $thisEl.find('#showMore');

                    expect($showMoreBtn).to.exist;

                    done();
                });

                it('Try to showMore', function () {
                    var projectsUrl = new RegExp('\/projects\/', 'i');
                    var $thisEl = thumbnailsView.$el;
                    var $showMoreBtn = $thisEl.find('#showMore');

                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeProjectsForThumbnails)]);
                    $showMoreBtn.click();
                    server.respond();

                    expect($thisEl.find('#thumbnailContent')).to.exist;
                    expect($thisEl.find('.thumbnail').length).to.be.equals(6);
                });

                it('Try to filtered projects', function () {
                    var $selectedItem1;
                    var $selectedItem2;
                    var $contactBtn;
                    var $projectNameBtn;
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var projectsUrl = new RegExp('\/projects\/', 'i');
                    var $selectedFilters;

                    $searchArrow.click();

                    // select contact
                    $contactBtn = $searchContainer.find('#customerFullContainer >.groupName');
                    $contactBtn.click();
                    $selectedItem1 = $searchContainer.find('li[data-value="55b92ad621e4b7c40f000635"]');
                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeProjectsForThumbnails)]);
                    $selectedItem1.click();
                    server.respond();
                    // server.respond();
                    expect($thisEl.find('.thumbnail').length).to.be.equals(6);

                    // select project name
                    $projectNameBtn = $searchContainer.find('#nameFullContainer >.groupName');
                    $projectNameBtn.click();
                    $selectedItem2 = $searchContainer.find('li[data-value="56e689c75ec71b00429745a9"]');

                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({data: [PROJECTS.fakeProjectsForThumbnails.data[0]]})]);
                    $selectedItem2.click();
                    server.respond();
                    expect($thisEl.find('.thumbnail').length).to.be.equals(1);
                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeProjectsForThumbnails)]);
                    $selectedItem2.click();
                    server.respond();
                    expect($thisEl.find('.thumbnail').length).to.be.equals(3);
                    $selectedFilters = $searchContainer.find('.removeValues');

                    expect($selectedFilters).to.have.lengthOf(1);
                    // close project name filter

                    $selectedFilters.click();
                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeProjectsForThumbnails)]);
                    server.respond();
                    $selectedFilters = $searchContainer.find('.removeValues');
                    expect($selectedFilters).to.have.lengthOf(0);
                    expect(window.location.hash).to.be.equals('#easyErp/Projects/thumbnails/c=3');
                });

                it('Try to change project status', function () {
                    var $statusSelectedItem;
                    var $needItem = $thisEl.find('#55b92ad621e4b7c40f00065f');
                    var $projectStatusBtn = $needItem.find('.stageSelect');
                    var projectUrl = new RegExp('\/projects\/', 'i');
                    var stage;

                    server.respondWith('PATCH', projectUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    server.respondWith('GET', projectUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeProjectsForThumbnailsAfterChooseWorkflow)]);
                    $projectStatusBtn.click();
                    $statusSelectedItem = $needItem.find('.newSelectList li[data-status="inprogress"]');
                    $statusSelectedItem.click();
                    server.respond();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Projects/thumbnails/c=3');

                    $needItem = $thisEl.find('#55b92ad621e4b7c40f00065f');
                    stage = $needItem.find('a.stageSelect').text().toLowerCase();
                    expect(stage).to.be.equals('in progress');
                });

                it('Try to change health of project', function () {
                    var $healthSelectedItem;
                    var $needItem = $thisEl.find('#55b92ad621e4b7c40f00065f');
                    var $projectHealthBtn = $needItem.find('.health-container');
                    var projectUrl = new RegExp('\/projects\/', 'i');

                    $projectHealthBtn.click();
                    $healthSelectedItem = $needItem.find('ul li div.health1');

                    server.respondWith('PATCH', projectUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $healthSelectedItem.click();
                    server.respond();

                    expect($needItem.find('.health-container a')).to.have.class('health1');
                    expect(window.location.hash).to.be.equals('#easyErp/Projects/thumbnails/c=3');
                });

                it('Try to open CreateView', function () {
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var usersUrl = '/users/forDd';
                    var employeesUrl = '/employees/getPersonsForDd';
                    var customerUrl = '/customers/';
                    var $dialog;

                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeUsers)]);
                    server.respondWith('GET', employeesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeEmployees)]);
                    server.respondWith('GET', customerUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeCustomers)]);

                    $createBtn.click();

                    $dialog = $('.ui-dialog');
                    // thumbnailsView.createItem();

                    server.respond();
                    server.respond();

                    expect($dialog).to.exist;
                    expect($dialog).to.have.length.below(2);
                });

                it('Try to change tabs', function () {
                    var $dialogEl = $('.ui-dialog');
                    var $tabs = $dialogEl.find('ul.dialog-tabs > li');
                    var $firstTab = $dialogEl.find('.dialog-tabs > li:nth-child(1) > a');
                    var $secondTab = $dialogEl.find('.dialog-tabs > li:nth-child(2) > a');

                    expect($tabs).to.exist;
                    expect($tabs).to.have.lengthOf(3);

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($secondTab).to.have.class('active');

                    $firstTab.click();
                    expect($firstTab).to.have.class('active');

                });

                it('Try to create item without required data', function () {
                    var $createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var spyResponse;

                    $createBtn.click();
                    spyResponse = mainSpy.args[0][0];

                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to set set required data to CreateView', function () {
                    var $createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var $dialogEl = $('.ui-dialog');
                    var $projectNameEl = $dialogEl.find('#projectName');
                    var $projectDescEl = $dialogEl.find('#projectShortDesc');
                    var $startDate = $dialogEl.find('#StartDate');
                    var $endDate = $dialogEl.find('#EndDateTarget');
                    var projectsUrl = '/projects/';
                    var $selectedItem;
                    var $salesManagerSelect;
                    var $projectHealthSelect;
                    var $customerSelect;
                    var $next;
                    var $prev;

                    $projectNameEl.val('Test');
                    $projectDescEl.val('Test');
                    $startDate.val('5 Apr, 2016');
                    $endDate.val('25 Apr, 2016');

                    // select sales manager
                    $salesManagerSelect = $dialogEl.find('#projectManagerDD');
                    $salesManagerSelect.click();
                    $next = $dialogEl.find('.next');
                    $next.click();
                    $prev = $dialogEl.find('.prev');
                    $prev.click();
                    $selectedItem = $dialogEl.find('#55b92ad221e4b7c40f000084');
                    $selectedItem.click();

                    // select customer
                    $customerSelect = $dialogEl.find('#customerDd');
                    $customerSelect.click();
                    $selectedItem = $dialogEl.find('#55b92ad521e4b7c40f00060e');
                    $selectedItem.click();

                    // select project health
                    $projectHealthSelect = $dialogEl.find('#health a');
                    $projectHealthSelect.click();
                    $selectedItem = $dialogEl.find('.health2');
                    $selectedItem.click();

                    server.respondWith('POST', projectsUrl, [201, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Created success'})]);
                    $createBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Projects/thumbnails/c=3');
                });

                it('Close CreateView', function () {
                    var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });


                it('Try to open EditView', function () {
                    var $needItem = $thisEl.find('#55b92ad621e4b7c40f00065f');
                    var projectFormUrl = new RegExp('\/projects\/', 'i');
                    var usersUrl = '/users/forDd';
                    var employeesUrl = '/employees/getPersonsForDd';
                    var customerUrl = '/customers/';

                    server.respondWith('GET', projectFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeProjectById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeUsers)]);
                    server.respondWith('GET', employeesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeEmployees)]);
                    server.respondWith('GET', customerUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(PROJECTS.fakeCustomers)]);
                    $needItem.click();
                    server.respond();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Projects/form/55b92ad621e4b7c40f00065f');
                });
            });

        });

        describe('FormView', function () {
            var $thisEl;
            var projectModel;

            before(function () {
                window.location.hash = '#easyErp/Projects/form/55b92ad621e4b7c40f00065f';

            });

            describe('INITIALIZE', function () {
                var server;
                var mainSpy;
                var windowConfirmStub;
                var fakeClock;

                before(function () {
                    server = sinon.fakeServer.create();
                    mainSpy = sinon.spy(App, 'render');
                    windowConfirmStub = sinon.stub(window, 'confirm');
                    fakeClock = sinon.useFakeTimers();
                });

                after(function () {
                    server.restore();
                    mainSpy.restore();
                    fakeClock.restore();

                    windowConfirmStub.restore();
                });


                it('Try to create FormView', function (done) {
                    var projectsUrl = new RegExp('\/Projects\/form', 'i');
                    var jobsUrl = new RegExp('\/jobs\/', 'i');
                    var projectTypeUrl = '/projectType';
                    var workflowsProjectsUrl = new RegExp('\/workflows\/fetch', 'i');;
                    var invoiceUrl = new RegExp('\/projects\/55b92ad621e4b7c40f00065f\/invoices', 'i');
                    var wTrackUrl = new RegExp('\/projects\/55b92ad621e4b7c40f00065f\/weTracks', 'i');
                    var paymentsUrl = new RegExp('\/projects\/55b92ad621e4b7c40f00065f\/payments', 'i');
                    var quotationUrl = new RegExp('\/projects\/55b92ad621e4b7c40f00065f\/quotations', 'i');
                    var employeesForDDUrl = '/employees/getForDD';
                    var bonusTypeUrl = '/bonusType/list';

                    // create FormView

                    projectModel = new ProjectModel();
                    projectModel.urlRoot = '/Projects/form';

                    server.respondWith('GET', projectsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeProjectByIdForForm)]);
                    projectModel.fetch({
                        data   : {id: '55b92ad621e4b7c40f00065f'},
                        success: function (model) {
                            formView = new FormView({
                                model: model
                            });

                            server.respondWith('GET', jobsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeJobs)]);
                            server.respondWith('GET', projectTypeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeProjectsType)]);
                            server.respondWith('GET', workflowsProjectsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeWorkflowsProject)]);
                            server.respondWith('GET', invoiceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeInvoice)]);
                            server.respondWith('GET', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeWTrack)]);
                            server.respondWith('GET', paymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakePayments)]);
                            server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeQuotations)]);
                            server.respondWith('GET', bonusTypeUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeBonusType)]);
                            server.respondWith('GET', employeesForDDUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeEmployeesForDD)]);
                            formView.render();
                            server.respond();
                            server.respond();
                            server.respond();
                            server.respond();
                            server.respond();
                            server.respond();
                            server.respond();
                            server.respond();
                            server.respond();

                            fakeClock.tick(500);

                            $thisEl = formView.$el;
                            expect($thisEl.find('.form-holder')).to.exist;

                            done();
                        },
                        error  : function (model, response) {
                            done(response)
                        }
                    });

                    server.respond();
                });

                /* it('Try to delete job row', function () {
                var $dialogEl;
                var $needRow;
                var $addItemBtn;
                var $trashBtn;
                var $createJob = $thisEl.find('#createJob');
                var employeesForDDUrl = new RegExp('\/employees\/getForDD', 'i');
       
                server.respondWith('GET', employeesForDDUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeesForDD)]);
                $createJob.click();
                server.respond();
       
                expect($('.ui-dialog')).to.exist;
       
                $dialogEl = $('.ui-dialog');
                $addItemBtn = $dialogEl.find('#addNewEmployeeRow');
                $addItemBtn.click();
       
                $needRow = $dialogEl.find('tbody > tr:nth-child(1)');
                $trashBtn = $dialogEl.find('td.remove > a');
       
                expect($trashBtn).to.have.class('hidden');
                $needRow.mouseover();
                expect($trashBtn).to.not.have.class('hidden');
                $needRow.mouseleave();
                expect($trashBtn).to.have.class('hidden');
       
                $needRow.mouseover();
       
                $trashBtn.click();
                expect($dialogEl.find('tbody > tr').length).to.be.equals(1);
                });
       
                it('Try to add job without required data', function () {
                var spyResponse;
                var $dialogEl = $('.ui-dialog');
                var $generateBtn = $dialogEl.find('#generateBtn');
                var $addItemBtn = $dialogEl.find('#addNewEmployeeRow');
       
                $addItemBtn.click();
       
                $generateBtn.click();
                spyResponse = mainSpy.args[0][0];
       
                expect(spyResponse).to.have.property('type', 'notify');
                expect(spyResponse).to.have.property('message', 'Please, enter all information first.');
       
                });
       
                it('Try to add job with bad JobName', function () {
                var $jobNameEl;
                var $dialogEl;
                var $addItemBtn;
                var $next;
                var $prev;
                var $employeeSelect;
                var $selectedItem;
                var $startDate;
                var $endDate;
                var spyResponse;
                var $generateBtn;
                var $generateType;
       
                $dialogEl = $('.ui-dialog');
                $jobNameEl = $dialogEl.find('#jobName');
                $jobNameEl.val('<input>');
                $addItemBtn = $dialogEl.find('#addNewEmployeeRow');
       
                $addItemBtn.click();
       
                $employeeSelect = $dialogEl.find('td[data-content="employee"] > a.current-selected');
                $employeeSelect.click();
                $next = $dialogEl.find('.next');
                $next.click();
                $prev = $dialogEl.find('.prev');
                $prev.click();
                $selectedItem = $dialogEl.find('#564dac3e9b85f8b16b574fea');
                $selectedItem.click();
                $startDate = $dialogEl.find('.startDate');
                $startDate.val('11 Apr, 2016');
                $startDate.closest('td').removeClass('errorContent');
                $generateType = $dialogEl.find('a.generateType');
                $generateType.click();
                $selectedItem = $dialogEl.find('.generateTypeUl > li[data-content="byHours"]');
                $selectedItem.click();
                $endDate = $dialogEl.find('.endDate');
                $endDate.val('40');
                $endDate.closest('td').removeClass('errorContent');
                $generateBtn = $dialogEl.find('#generateBtn');
       
                $generateBtn.click();
                spyResponse = mainSpy.args[1][0];
       
                expect(spyResponse).to.have.property('type', 'notify');
                expect(spyResponse).to.have.property('message', 'Please, enter correct Job name!');
       
                });
       
                it('Try to add job', function () {
                var $jobNameEl;
                var $generateBtn;
                var $mondayInput;
                var $dialogEl = $('.ui-dialog');
                var $needRow = $dialogEl.find('tbody > tr:nth-child(1) > td[data-content="1"]');
                var wTrackUrl = '/wTrack/generateWTrack';
       
                $jobNameEl = $dialogEl.find('#jobName');
                $jobNameEl.val('Test');
       
                $needRow.click();
                $mondayInput = $needRow.find('input');
                $mondayInput.val('7');
       
                $generateBtn = $dialogEl.find('#generateBtn');
                server.respondWith('POST', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Created success'})]);
                $generateBtn.click();
                server.respond();
       
                //expect($('.ui-dialog')).to.not.exist;
                });
       
                it('Try to expand wTrack list', function () {
                var $firstTab = $thisEl.find('#overviewTab');
                var $needTd = $thisEl.find('#projectTeam > tr:nth-child(1) > td:nth-child(7)');
       
                $firstTab.click();
                $needTd.click();
                expect($('#projectTeam .subRow')).to.exist;
       
                $needTd.click();
                expect($('#projectTeam .subRow')).to.not.exist;
       
                });
       
                it('Try to quick edit job name', function () {
                var $jobInput;
                var $saveBtn;
                var $needRow = $thisEl.find('#jobsItem[data-id="570cc46ecf6668c214f2ba4b"]');
                var $needTd = $needRow.find('td.editableJobs');
                var jobsUpdateUrl = '/jobs/update';
       
                $needTd.dblclick();
       
                $jobInput = $needTd.find('input');
                $jobInput.val('Test2');
                $saveBtn = $needTd.find('#saveName');
       
                server.respondWith('POST', jobsUpdateUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                $saveBtn.click();
                server.respond();
       
                expect($needRow.find('#jobsName').text().trim()).to.be.equals('Test2');
                });
       
                it('Try to delete job item', function () {
                var $needRow = $thisEl.find('#jobsItem[data-id="570cc46ecf6668c214f2ba4b"]');
                var $deleteBtn = $needRow.find('.fa-trash');
                var jobsRemoveUrl = '/jobs/remove';
       
                windowConfirmStub.returns(true);
       
                $needRow.mouseover();
                //expect($needRow.find('.fa-trash')).to.have.not.class('hidden');
       
                $needRow.mouseleave();
                //expect($needRow.find('.fa-trash')).to.have.class('hidden');
       
                server.respondWith('POST', jobsRemoveUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Deleted success'})]);
                $deleteBtn.click();
                server.respond();
       
                expect($thisEl.find('#jobsItem[data-id="570cc46ecf6668c214f2ba4b"]')).to.not.exist;
                expect(window.location.hash).to.be.equals('#easyErp/Projects/form/570cc46ecf6668c214f2ba4b');
                });
       
                it('Try to go to quotationView', function () {
                var $quotationBtn;
                var $closeBtn;
                var orderUrl = new RegExp('\/Order\/form\/', 'i');
       
                $quotationBtn = $thisEl.find('#projectTeam > tr:nth-child(1) > td > a.quotation');
       
                server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeOrder)]);
                $quotationBtn.click();
                server.respond();
       
                expect($('.ui-dialog')).to.exist;
                $closeBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button');
       
                $closeBtn.click();
                expect($('.ui-dialog')).to.not.exist;
       
                });
       
                it('Try to go to invoiceView', function () {
                var $invoiceBtn;
                var $closeBtn;
                var invoiceUrl = new RegExp('\/Invoice\/form', 'i');
       
                $invoiceBtn = $thisEl.find('#projectTeam > tr:nth-child(1) > td > a.invoice');
       
                server.respondWith('GET', invoiceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeInvoice)]);
                $invoiceBtn.click();
                server.respond();
       
                expect($('.ui-dialog')).to.exist;
       
                $closeBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button');
       
                $closeBtn.click();
                expect($('.ui-dialog')).to.not.exist;
       
                });*/
       
                });
       
                describe('TimeCardView', function () {
                var server;
                var mainSpy;
                var windowConfirmStub;
       
                before(function () {
                var $secondTab = $thisEl.find('#timesheetTab');
                $secondTab.click();
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                });
       
                after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                });
       
                it('Try to sort list', function () {
                var $sortBtn = $thisEl.find('th[data-sort="employee.name"]');
                var wTrackUrl = new RegExp('\/wTrack\/', 'i');
       
                server.respondWith('GET', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({data : [PROJECTS.fakeWTrack.data[1], PROJECTS.fakeWTrack.data[0]], count : 200})]);
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('55b92ad821e4b7c40f0006e3');
       
                server.respondWith('GET', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(PROJECTS.fakeWTrack)]);
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('55b92ad821e4b7c40f00072a');
       
                });
       
           /*     it('Try to switch page counter with not saved state', function () {

                var spyResponse;
                var $selectedItem;
                var $deleteBtn;
                var $pageListEl = $thisEl.find('.pageList');
                var $needRow = $($thisEl.find('#listTable > tr:nth-child(1)')[0]);
                var $MondayTd = $needRow.find('td[data-content="1"]');

                $MondayTd.click();
                $selectedItem = $thisEl.find('#565f0fa6f6427f253cf6bf19');
                $selectedItem.click();
       
                $deleteBtn = $thisEl.find('#deletewTrack');
       
                $firstBtn.click();
                spyResponse = mainSpy.args[0][0];
       
                expect(spyResponse).to.have.property('type', 'notify');
       
                $deleteBtn.click();
                });*/
       
                it('Try to switch page counter', function () {
                var $pageListEl = $thisEl.find('.pageList');
                var $firstBtn = $pageListEl.find('a:nth-child(1)');
                var $secondBtn = $pageListEl.find('a:nth-child(2)');
                var $thirdBtn = $pageListEl.find('a:nth-child(3)');
                var $allBtn = $pageListEl.find('a:nth-child(4)');
                var wTrackUrl = new RegExp('\/wTrack\/list', 'i');
                var wTrackTotalUrl = new RegExp('\/wTrack\/totalCollectionLength', 'i');
       
                server.respondWith('GET', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify( PROJECTS.fakeWTrack)]);

                $firstBtn.click();
                server.respond();
       
                expect($thisEl.find('#listTable')).to.exist;
                expect($pageListEl.find('a:nth-child(1)')).to.have.class('selectedItemsNumber');
       
                $secondBtn.click();
                server.respond();
       
                expect($thisEl.find('#listTable')).to.exist;
                expect($pageListEl.find('a:nth-child(2)')).to.have.class('selectedItemsNumber');
       
                $thirdBtn.click();
                server.respond();
       
                expect($thisEl.find('#listTable')).to.exist;
                expect($pageListEl.find('a:nth-child(3)')).to.have.class('selectedItemsNumber');
       
                $allBtn.click();
                server.respond();
       
                expect($thisEl.find('#listTable')).to.exist;
                expect($pageListEl.find('a:nth-child(4)')).to.have.class('selectedItemsNumber');
                });
       
                it('Try to changePage', function () {
                var $nextPageBtn = $thisEl.find('#nextPage');
                var $prevPageBtn = $thisEl.find('#previousPage');
                var $firstPage = $thisEl.find('#firstShowPage');
                var $lastPage = $thisEl.find('#lastShowPage');
                var wTrackUrl = new RegExp('\/wTrack\/list', 'i');
                var wTrackTotalUrl = new RegExp('\/wTrack\/totalCollectionLength', 'i');
                var event;
       
                server.respondWith('GET', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify( PROJECTS.fakeWTrack)]);
                $nextPageBtn.prop('disabled', false); // we have not data for few pages, and we hardcode that the next page is not disabled
                $nextPageBtn.click();
                server.respond();
       
                expect($thisEl.find('#listTable')).to.exist;
       
                $prevPageBtn.prop('disabled', false); // we have not data for few pages, and we hardcode that the next page is not disabled
                $prevPageBtn.click();
                server.respond();

       
                expect($thisEl.find('#listTable')).to.exist;
       
                $firstPage.prop('disabled', false); // we have not data for few pages, and we hardcode that the next page is not disabled
                $firstPage.click();
                server.respond();
       
                expect($thisEl.find('#listTable')).to.exist;
       
                $lastPage.prop('disabled', false); // we have not data for few pages, and we hardcode that the next page is not disabled
                $lastPage.click();
                server.respond();
       
                expect($thisEl.find('#listTable')).to.exist;
       
                });
       
                it('Try to show some page', function () {
                var $selectedItem;
                var $currentPageListEl = $thisEl.find('.currentPageList');
       
                $currentPageListEl.mouseover();
                $selectedItem = $thisEl.find('#pageList > li:nth-child(1)');
                $selectedItem.click();
                server.respond();
       
                expect($thisEl.find('#listTable')).to.exist;
                });
       
                it('Try to cancel some changes', function () {
                var $selectedItem;
                var $deleteBtn;
                var $needRow = $($thisEl.find('#listTable > tr:nth-child(1)')[0]);
                var $employeeTd = $needRow.find('td[data-content="employee"]');
       
                $employeeTd.click();
                $selectedItem = $thisEl.find('#55b92ad221e4b7c40f000031');
                $selectedItem.click();
                $deleteBtn = $thisEl.find('#deletewTrack');
       
                $deleteBtn.click();
       
                $needRow = $($thisEl.find('#listTable > tr:nth-child(1)')[0]);
       
                expect($needRow.find('td[data-content="employee"]').text().trim()).to.be.equals('Vasilisa Klimchenko')
       
                });
       
                it('Try to delete item with error 403', function () {
                var $deleteBtn;
                var spyResponse;
                var $needRow = $($thisEl.find('#listTable > tr:nth-child(1)')[0]);
                var $needCheckBox = $needRow.find('.notForm > input');
                var wTrackUrl = new RegExp('\/wTrack\/', 'i');
       
                windowConfirmStub.returns(true);
       
                $needCheckBox.attr('checked', true);
                $deleteBtn = $thisEl.find('#deletewTrack');
       
                server.respondWith('DELETE', wTrackUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete error'})]);
                $deleteBtn.click();
                server.respond();
                spyResponse = mainSpy.args[1][0];
       
                expect(spyResponse).to.have.property('type', 'error');
       
                });
       
                it('Try to delete item', function () {
                var $deleteBtn;
                var $needRow = $($thisEl.find('#listTable > tr:nth-child(1)')[0]);
                var $needCheckBox = $needRow.find('.notForm > input');
                var wTrackUrl = new RegExp('\/wTrack\/', 'i');
       
                windowConfirmStub.returns(true);
       
                $needCheckBox.attr('checked', true);
                $deleteBtn = $thisEl.find('#deletewTrack');
       
                server.respondWith('DELETE', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                $deleteBtn.click();
                server.respond();
       
                expect($($thisEl.find('#listTable > tr:nth-child(1)')[0]).attr('data-id')).to.be.equals('55b92ad821e4b7c40f00072a');
                $needCheckBox.attr('checked', false);
                });
       
                it('Try to copy some row', function () {
                var $copyBtn;
                var $needRow = $thisEl.find('#listTable > tr:nth-child(1)');
                var $needCheckBox = $needRow.find('.notForm > input');
       
                $needCheckBox.click();
                $copyBtn = $thisEl.find('#top-bar-copyBtn');
                $copyBtn.click();
       
                expect($thisEl.find('#listTable > .false > td:nth-child(2)').text().trim()).to.be.equals('New');
       
                });
       
                it('Try to create new item', function () {
                var $createBtn;
                var $saveBtn;
                var $sprintTd;
                var $employeeTd;
                var $selectedItem;
                var $next;
                var $prev;
                var $newRow;
                var jobUrl = new RegExp('\/jobs\/getForDD', 'i');
                var wTrackUrl = '/wTrack/';
       
                $createBtn = $thisEl.find('#createBtn');
                $createBtn.click();
                $newRow = $($thisEl.find('#listTable > tr:nth-child(1)')[0]);
                $sprintTd = $newRow.find('td[data-content="jobs"]');
                server.respondWith('GET', jobUrl, [200, {"Content-Type": "application/json"}, JSON.stringify( PROJECTS.fakeJobsForWTrack)]);
                $sprintTd.click();
                server.respond();
                $selectedItem = $thisEl.find('#570dfbd96625f34212d01f39');
                $selectedItem.click();
                $employeeTd = $newRow.find('td[data-content="employee"]');
                $employeeTd.click();
                $next = $thisEl.find('.next');
                $next.click();
                $prev = $thisEl.find('.prev');
                $prev.click();
                $selectedItem = $thisEl.find('#564dac3e9b85f8b16b574fea');
                $selectedItem.click();
       
                $saveBtn = $thisEl.find('#savewTrack');
       
                server.respondWith('POST', wTrackUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                "_id": "570e62e158fa72265bcc12fa",
                id   : "570e62e158fa72265bcc12fa"
                })]);
                $saveBtn.click();
                server.respond();
       
                expect($newRow.find('td:nth-child(2)').text().trim()).to.be.equals('New');
                });
       
                });
       
                describe('QuotationView', function () {
                var server;
                var mainSpy;
                var windowConfirmStub;
       
                before(function () {
                var $quotationTab = $thisEl.find('#quotationsTab');
       
                $quotationTab.click();
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                });
       
                after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                });
       
                it('Try to sort quotation list', function () {
                var quotationUrl = new RegExp('\/quotation\/list', 'i');
                var $sortBtn = $thisEl.find('#quotationTable tr > th[data-sort="name"]');
       
                server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotations)]);
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#quotationTable')).to.exist;
       
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#quotationTable')).to.exist;
                });
       
                it('Try to go to EditQuotationView', function () {
                var $cancelBtn;
                var $needItem = $thisEl.find('#quotationTable tr[data-id="570f9563ccb41cca20cd9261"] > td:nth-child(3)');
                var quotationFormUrl = new RegExp('\/quotation\/form\/', 'i');
       
                server.respondWith('GET', quotationFormUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotationById)]);
                $needItem.click();
                server.respond();
       
                expect($('.ui-dialog')).to.exist;
       
                $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
       
                $cancelBtn.click();
       
                expect($('.ui-dialog')).to.not.exist;
                });
       
                it('Try to delete item with 403 error', function () {
                var $deleteBtn;
                var spyResponse;
                var $needRow = $thisEl.find('#quotationTable tr[data-id="570f9563ccb41cca20cd9261"]');
                var $needCheckBox = $needRow.find('.notForm > input');
                var quotationFormUrl = new RegExp('\/quotation\/', 'i');
       
                windowConfirmStub.returns(true);
       
                $needCheckBox.click();
                $deleteBtn = $thisEl.find('#removeQuotation');
       
                server.respondWith('DELETE', quotationFormUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({success: 'Error delete'})]);
                $deleteBtn.click();
                server.respond();
                spyResponse = mainSpy.args[0][0];
       
                expect(spyResponse).to.have.property('type', 'error');
                });
       
                it('Try to delete item', function () {
                var $deleteBtn;
                var quotationFormUrl = new RegExp('\/quotation\/', 'i');
       
                $deleteBtn = $thisEl.find('#removeQuotation');
       
                server.respondWith('DELETE', quotationFormUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Deleted success'})]);
                $deleteBtn.click();
                server.respond();
       
                expect($thisEl.find('#quotationTable tr[data-id="570f9563ccb41cca20cd9261"]')).to.not.exist;
       
                });
       
                it('Try to open CreateView', function () {
                var $createBtn = $thisEl.find('#createQuotation');
                var productUrl = new RegExp('\/product\/', 'i');
                var projectsUrl = '/getProjectsForDd';
                var projectsForWTrackUrl = '/project/getForWtrack';
                var customersUrl = '/customers/';
       
                server.respondWith('GET', productUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProduct)]);
                server.respondWith('GET', projectsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeProjectForDd)]);
                server.respondWith('GET', customersUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCustomers)]);
                $createBtn.click();
                server.respond();
                server.respond();
                server.respond();
       
       
                expect($('.ui-dialog')).to.exist;
       
                });
       
                it('Try to create quotation without product', function () {
                var spyResponse;
                var $saveBtn = $('#create-person-dialog');
       
                $saveBtn.click();
       
                spyResponse = mainSpy.args[1][0];
       
                expect(spyResponse).to.have.property('type', 'error');
                expect(spyResponse).to.have.property('message', 'Products can not be empty.');
       
                });
       
                it('Try to create quotation with error response from server', function () {
       
                var $saveBtn = $('#create-person-dialog');
                var quotationUrl = '/quotation/';
       
                server.respondWith('POSTf', quotationUrl, [404, {"Content-Type": "application/json"}, JSON.stringify({success: 'Created success'})]);
                $saveBtn.click();
                server.respond();
       
                expect(window.location.hash).to.be.equals('#easyErp/Projects/form/570f9563ccb41cca20cd9261');
                });
       
                it('Try to create quotation', function () {
                var $selectedItem;
                var $jobSelectBtn;
                var $currentRow;
                var $unitPriceTd;
                var $editPriceBtn;
                var $savePriceBtn;
                var $cancelPriceBtn;
                var $priceInput;
                var $dialog = $('.ui-dialog');
                var $addNewItemBtn = $dialog.find('.addProductItem > a');
                var $createBtn = $('#create-person-dialog');
                var quotationUrl = '/quotation/';
                var jobsForProjectUrl = new RegExp('\/jobs\/getForDD', 'i');
       
                // creating new product row
                $addNewItemBtn.click();
       
                $currentRow = $dialog.find('tbody > tr.productItem:nth-child(1)');
                $jobSelectBtn = $currentRow.find('td[data-name="jobs"] > .current-selected.jobs');
       
                server.respondWith('GET', jobsForProjectUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsById)]);
                $jobSelectBtn.click();
                server.respond();
                $selectedItem = $dialog.find('#570ddef86625f34212d01f2d');
                $selectedItem.click();
       
                $unitPriceTd = $currentRow.find('td[data-name="price"]');
                $unitPriceTd.mouseover();
                $editPriceBtn = $currentRow.find('#editSpan');
                $editPriceBtn.click();
                $cancelPriceBtn = $currentRow.find('#cancelSpan');
       
                $cancelPriceBtn.click();
                $unitPriceTd.mouseover();
                $editPriceBtn = $currentRow.find('#editSpan');
       
                expect($currentRow.find('#saveSpan')).to.not.exist;
                expect($currentRow.find('#cancelSpan')).to.not.exist;
                expect($currentRow.find('#editInput')).to.not.exist;
       
                $editPriceBtn.click();
                $savePriceBtn = $currentRow.find('#saveSpan');
                $priceInput = $currentRow.find('#editInput');
                $priceInput.val('5000');
                $savePriceBtn.click();
       
                expect($currentRow.find('td[data-name="price"]').text().trim()).to.be.equals('5000');
                expect($currentRow.find('td.subtotal').text().trim()).to.be.equals('5000.00');
                expect($dialog.find('#totalAmount').text().trim()).to.be.equals('5000.00');
                server.respondWith('POST', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Created success'})]);
                $createBtn.click();
                server.respond();
       
                expect($('.ui-dialog')).to.not.exist;
       
                });
                });
       
                describe('PaymentsView', function () {
                var server;
                var mainSpy;
                var windowConfirmStub;
       
                before(function () {
                var $paymentTab = $thisEl.find('#paymentsTab');
       
                $paymentTab.click();
       
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                });
       
                after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                });
       
                it('Try to sort payments list', function () {
                var paymentsUrl = new RegExp('\/payment\/customers\/list', 'i');
                var $sortBtn = $thisEl.find('#paymentsTable tr > th[data-sort="supplier.name.first"]');
       
                server.respondWith('GET', paymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakePayments)]);
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#paymentsTable #listTable tr:nth-child(1)').attr('data-id')).to.be.equals('55b92ae321e4b7c40f0013cd');
       
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#paymentsTable #listTable tr:nth-child(1)').attr('data-id')).to.be.equals('55b92ae321e4b7c40f0013cd');
                });
       
                it('Try to open EditView', function () {
                var $closeBtn;
                var $needTd = $thisEl.find('#paymentsTable #listTable tr:nth-child(1) > td:nth-child(3)');
       
                $needTd.click();
       
                expect($('.ui-dialog')).to.exist;
                $closeBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-payment-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button');
                $closeBtn.click();
       
                expect($('.ui-dialog')).to.not.exist;
                });
       
                it('Try to change and save payment', function () {
                var $dateInput;
                var $saveBtn;
                var $dateTd = $thisEl.find('#paymentsTable tr[data-id="55b92ae321e4b7c40f0013cd"] > td[data-content="date"]');
                var paymentsUrl = '/payment/customers/';
       
                $dateTd.click();
                $dateInput = $dateTd.find('input');
                $dateInput.val('23 Apr, 2016');
       
                $saveBtn = $thisEl.find('#savePayment');
       
                server.respondWith('PATCH', paymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                $saveBtn.click();
                server.respond();
       
                // expect($thisEl.find('#paymentsTable tr[data-id="55b92ae321e4b7c40f0013cd"] > td[data-content="date"]').text()).to.be.equals('23 Apr, 2016');
                });
       
                it('Try to delete item with 403 error', function () {
                var spyResponse;
                var $deleteBtn = $thisEl.find('#removePayment');
                var paymentsUrl = new RegExp('\/customerPayments\/', 'i');
                var $needCheckBox = $thisEl.find('#paymentsTable tr[data-id="55b92ae321e4b7c40f0013cd"] > td.notForm > input');
                $needCheckBox.click();
       
                windowConfirmStub.returns(true);
       
                server.respondWith('DELETE', paymentsUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();
       
                spyResponse = mainSpy.args[0][0];
       
                expect(spyResponse).to.have.property('type', 'error');
                expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
       
                });
       
                it('Try to delete item', function () {
       
                var $deleteBtn = $thisEl.find('#removePayment');
                var paymentsUrl = new RegExp('\/customerPayments\/', 'i');
       
                windowConfirmStub.returns(true);
       
                server.respondWith('DELETE', paymentsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                $deleteBtn.click();
                server.respond();
       
                expect($thisEl.find('#paymentsTable tr[data-id="55b92ae321e4b7c40f0013cd"]')).to.not.exist;
                });
       
                });
       
                describe('InvoiceView', function () {
                var server;
                var mainSpy;
                var windowConfirmStub;
       
                before(function () {
                var $invoiceTab = $thisEl.find('#invoicesTab');
       
                $invoiceTab.click();
       
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                });
       
                after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                });
       
                it('Try to sort invoice list', function () {
                var invoiceUrl = new RegExp('\/Invoice\/list', 'i');
                var $sortBtn = $thisEl.find('#invoices tr > th[data-sort="name"]');
       
                server.respondWith('GET', invoiceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeInvoice[1], fakeInvoice[0]])]);
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#invoices #listTable tr:nth-child(1)').attr('data-id')).to.be.equals('5710e5873a8d9e4a38be9f11');
       
                server.respondWith('GET', invoiceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeInvoice)]);
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#invoices #listTable tr:nth-child(1)').attr('data-id')).to.be.equals('55b92ae121e4b7c40f001265');
                });
       
                it('Try to delete item with 403 error', function () {
                var $deleteBtn;
                var spyResponse;
                var $needRow = $thisEl.find('#invoices #listTable > tr:nth-child(2)');
                var $needCheckBox = $needRow.find('.notForm > input');
                var invoiceUrl = new RegExp('\/invoice\/', 'i');
       
                windowConfirmStub.returns(true);
       
                $needCheckBox.click();
                $deleteBtn = $thisEl.find('#removeInvoice');
       
                server.respondWith('DELETE', invoiceUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();
                spyResponse = mainSpy.args[0][0];
       
                expect(spyResponse).to.have.property('type', 'error');
                expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });
       
                it('Try to delete item', function () {
                var $deleteBtn;
                var invoiceUrl = new RegExp('\/invoice\/', 'i');
       
                windowConfirmStub.returns(true);
       
                $deleteBtn = $thisEl.find('#removeInvoice');
       
                server.respondWith('DELETE', invoiceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Deleted success'})]);
                $deleteBtn.click();
                server.respond();
       
                expect($thisEl.find('#invoices #listTable > tr[data-id="5710e5873a8d9e4a38be9f11"]')).to.not.exist;
                });
       
                it('Try to open EditView', function () {
                var $needTd = $thisEl.find('#invoices #listTable tr[data-id="55b92ae121e4b7c40f001265"] > td:nth-child(3)');
                var invoiceUrl = new RegExp('\/Invoice\/form', 'i');
       
                server.respondWith('GET', '/currentDb', [200, {"Content-Type": "application/json"}, 'micheldb']);
                server.respondWith('GET', invoiceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeInvoiceById)]);
                $needTd.click();
                server.respond();
                server.respond();
       
                expect($('.ui-dialog')).to.be.exist;
       
                });
       
                });
       
                describe('BonusView', function () {
                var server;
                var mainSpy;
                var windowConfirmStub;
       
                before(function () {
                var $bonusTab = $thisEl.find('#bonusTab');
       
                $bonusTab.click();
       
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                });
       
                after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                });
       
                it('Try to delete item', function () {
                var $deleteBtn;
                var $needRow = $thisEl.find('#bonusTable > tr:nth-child(3)');
                var $needCheckBox = $needRow.find('td:nth-child(1) > input');
                var projectsUrl = new RegExp('\/Projects\/', 'i');
       
                $needCheckBox.click();
       
                $deleteBtn = $thisEl.find('#removeBonus');
       
                server.respondWith('PUT', projectsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Update success'})]);
                $deleteBtn.click();
                server.respond();
       
                expect($thisEl.find('tr[data-id="570e4aa461cae96537ef44ab"]')).to.not.exist;
                });
       
                it('Check|uncheck all items', function () {
                var $checkAllItemBtn = $thisEl.find('#checkAll_bonus');
       
                $checkAllItemBtn.click();
                expect($thisEl.find('#bonusTable input[type="checkbox"]').prop('checked')).to.be.true;
       
                $checkAllItemBtn.click();
                expect($thisEl.find('#bonusTable input[type="checkbox"]').prop('checked')).to.be.false;
                });
       
                it('Try to update some bonus', function () {
                var $selectedItem;
                var $next;
                var $prev;
                var $saveBtn;
                var $needRow = $thisEl.find('#bonusTable > tr:nth-child(1)');
                var $bonusName = $needRow.find('td[data-content="bonus"]');
                var $employee = $needRow.find('td[data-content="employee"]');
       
                // select bonus
                $bonusName.click();
                $next = $thisEl.find('.next');
                $next.click();
                $prev = $thisEl.find('.prev');
                $prev.click();
                $selectedItem = $thisEl.find('#55b92ad521e4b7c40f00060a');
                $selectedItem.click();
       
                // select employee
                $employee.click();
                $next = $thisEl.find('.next');
                $next.click();
                $prev = $thisEl.find('.prev');
                $prev.click();
                $selectedItem = $thisEl.find('#55b92ad221e4b7c40f000084');
                $selectedItem.click();
       
                $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                $saveBtn.click();
       
                //server.respondWith('PUT', projectsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Update success'})]);
                formView.saveItem();
                server.respond();
       
                expect($thisEl.find('#bonusTable > tr[data-id="5604fc2082ca87623a000008"] > td[data-content="bonus"]').attr('data-id')).to.be.equals('55b92ad521e4b7c40f00060a');
                expect($thisEl.find('#bonusTable > tr[data-id="5604fc2082ca87623a000008"] > td[data-content="employee"]').attr('data-id')).to.be.equals('55b92ad221e4b7c40f000084');
       
                });
       
                it('Try to add bonus item', function () {
                var $addItemBtn = $thisEl.find('#createBonus');
       
                $addItemBtn.click();
       
                expect($('#false')).to.exist;
                });
       
                });
       
                describe('OrdersView', function () {
                var server;
                var mainSpy;
                var windowConfirmStub;
       
                before(function () {
                var $ordersTab = $thisEl.find('#ordersTab');
       
                $ordersTab.click();
       
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                });
       
                after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                });
       
                it('Try to sort orders list', function () {
                var $sortBtn = $thisEl.find('#ordersTable tr > th[data-sort="paymentInfo.total"]');
                var orderUrl = new RegExp('\/quotation\/list', 'i');
                var orderTotal = new RegExp('\/quotation\/totalCollectionLength', 'i');
       
                server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeQuotations[1], fakeQuotations[0]])]);
                server.respondWith('GET', orderTotal, [200, {"Content-Type": "application/json"}, JSON.stringify({
                count: 2
                })]);
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#orderTable > tr:nth-child(1)').attr('data-id')).to.be.equals('564cfd8da6e6390160c9f0fe');
       
                server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotations)]);
                $sortBtn.click();
                server.respond();
                expect($thisEl.find('#orderTable > tr:nth-child(1)').attr('data-id')).to.be.equals('570f9563ccb41cca20cd9261');
                });
       
       
                it('Try to open EditView', function () {
                var $needTd = $thisEl.find('#orderTable > tr[data-id="564cfd8da6e6390160c9f0fe"] > td:nth-child(3)');
                var orderUrl = new RegExp('\/Order\/form\/', 'i');
       
                server.respondWith('GET', orderUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeOrderById)]);
                $needTd.click();
                server.respond();
       
                expect($('.ui-dialog')).to.exist;
       
                });
            });

        });

        /* describe('ListView', function () {
        var server;
        var mainSpy;
        var windowConfirmStub;
        var $thisEl;
        var fakeClock;

        before(function () {
        server = sinon.fakeServer.create();
        mainSpy = sinon.spy(App, 'render');
        windowConfirmStub = sinon.stub(window, 'confirm');
        fakeClock = sinon.useFakeTimers();
        });

        after(function () {
        server.restore();
        mainSpy.restore();
        fakeClock.restore();
        windowConfirmStub.restore();
        });

        describe('INITIALIZE', function () {

        it('Try to create ListView', function (done) {
        var worlflowUrl = new RegExp('\/Workflows', 'i');

        server.respondWith('GET', worlflowUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWorkflows)]);
        listView = new ListView({
        startTime : new Date(),
        collection: projectsCollection
        });
        server.respond();

        fakeClock.tick(200);

        $thisEl = listView.$el;

        expect($thisEl.find('table')).to.have.class('list');

        done();
        });

        it('Try to change health of project', function () {
        var $healthSelectedItem;
        var $needRow = $thisEl.find('tr[data-id="55f55d31b81672730c000020"]');
        var $projectHealthBtn = $needRow.find('#health .health-container');
        var projectUrl = new RegExp('\/Projects\/', 'i');

        $projectHealthBtn.click();
        $healthSelectedItem = $needRow.find('#health ul li div.health2');

        server.respondWith('PATCH', projectUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
        $healthSelectedItem.click();
        server.respond();

        expect($needRow.find('#health a')).to.have.class('health2');

        });

        it('Try to change project status', function () {
        var $statusSelectedItem;
        var $needRow = $thisEl.find('tr[data-id="55f55d31b81672730c000020"]');
        var $projectStatusBtn = $needRow.find('a.stageSelect');
        var projectUrl = new RegExp('\/Projects\/', 'i');

        $projectStatusBtn.click();
        $statusSelectedItem = $needRow.find('.newSelectList li:nth-child(3)');

        server.respondWith('PATCH', projectUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
        $statusSelectedItem.click();
        server.respond();

        expect(window.location.hash).to.be.equals('#easyErp/Projects/list/p=1/c=100');
        });
        });
        });*/

    });
});
