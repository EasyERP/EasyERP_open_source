define([
    'modules',
    'text!fixtures/index.html',
    'collections/Workflows/WorkflowsCollection',
    'views/main/MainView',
    'views/Workflows/ContentView',
    'views/Workflows/TopBarView',
    'views/Workflows/list/ListItemView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, WorkflowsCollection, MainView, ContentView, TopBarView, ListItemView, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var fakeWorkflows = {
        data: [
            {
                _id         : "528ce51cf3f67bc40b000015",
                __v         : 0,
                attachments : [],
                name        : "Initial Qualification",
                sequence    : 6,
                status      : "New",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "52fa5108a7bec22c19000018",
                __v         : 0,
                attachments : [],
                name        : "Ready to teach",
                sequence    : 6,
                status      : "Pending",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce0cdf3f67bc40b00000c",
                __v         : 0,
                attachments : [],
                name        : "New",
                sequence    : 5,
                status      : "New",
                wId         : "Tasks",
                wName       : "task",
                source      : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce53bf3f67bc40b000016",
                __v         : 0,
                attachments : [],
                name        : "First Interview",
                sequence    : 5,
                status      : "In Progress",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528cdcb4f3f67bc40b000006",
                __v         : 0,
                attachments : [],
                name        : "New",
                sequence    : 4,
                status      : "New",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce131f3f67bc40b00000d",
                __v         : 0,
                attachments : [],
                name        : "In Progress",
                sequence    : 4,
                status      : "In Progress",
                wId         : "Tasks",
                wName       : "task",
                source      : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce553f3f67bc40b000017",
                __v         : 0,
                attachments : [],
                name        : "Second Interview",
                sequence    : 4,
                status      : "In Progress",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce74ef3f67bc40b00001e",
                __v         : 0,
                attachments : [],
                name        : "Draft",
                sequence    : 4,
                status      : "New",
                wId         : "Leads",
                wName       : "lead",
                source      : "lead",
                targetSource: [
                    "lead"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce7d0f3f67bc40b000021",
                __v         : 0,
                attachments : [],
                name        : "New",
                sequence    : 4,
                status      : "New",
                wId         : "Projects",
                wName       : "project",
                source      : "project",
                targetSource: [
                    "project"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "5555e54c6a3f01acae0b5564",
                name        : "Draft",
                sequence    : 4,
                status      : "New",
                wId         : "Purchase Invoice",
                wName       : "invoice",
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "55647d932e4aa3804a765ec9",
                name        : "Unpaid",
                sequence    : 4,
                status      : "New",
                wId         : "Sales Invoice",
                wName       : "invoice",
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528cdd2af3f67bc40b000007",
                __v         : 0,
                attachments : [],
                name        : "Qualification",
                sequence    : 3,
                status      : "In Progress",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce30cf3f67bc40b00000f",
                __v         : 0,
                attachments : [],
                name        : "Fixed",
                sequence    : 3,
                status      : "In Progress",
                wId         : "Tasks",
                wName       : "task",
                source      : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce5e3f3f67bc40b000018",
                __v         : 0,
                attachments : [],
                name        : "Internship",
                sequence    : 3,
                status      : "Pending",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce7e3f3f67bc40b000022",
                __v         : 0,
                attachments : [],
                name        : "Pending",
                sequence    : 3,
                status      : "Pending",
                wId         : "Projects",
                wName       : "project",
                source      : "project",
                targetSource: [
                    "project"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "52b4265cc033b7e25ac4f91c",
                attachments : [],
                name        : "Open",
                sequence    : 3,
                status      : "New",
                wId         : "Leads",
                wName       : "lead",
                source      : "lead",
                targetSource: [
                    "lead"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "5555bf276a3f01acae0b5560",
                name        : "Not Ordered",
                sequence    : 3,
                status      : "New",
                wId         : "Purchase Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "quotation"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "5555e570671a8b6800000003",
                sequence    : 3,
                status      : "In Progress",
                name        : "Partially Paid",
                wId         : "Purchase Invoice",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "55647b932e4aa3804a765ec5",
                name        : "Not Invoiced",
                sequence    : 3,
                status      : "New",
                wId         : "Sales Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "quotation"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "55647d952e4aa3804a765eca",
                sequence    : 3,
                status      : "In Progress",
                name        : "Partially Paid",
                wId         : "Sales Invoice",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528cde9ef3f67bc40b000008",
                __v         : 0,
                attachments : [],
                name        : "Proposition",
                sequence    : 2,
                status      : "In Progress",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce35af3f67bc40b000010",
                __v         : 0,
                attachments : [],
                name        : "Testing",
                sequence    : 2,
                status      : "In Progress",
                wId         : "Tasks",
                wName       : "task",
                source      : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce61bf3f67bc40b000019",
                __v         : 0,
                attachments : [],
                name        : "Contract Signed",
                sequence    : 2,
                status      : "Hired",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce779f3f67bc40b00001f",
                __v         : 0,
                attachments : [],
                name        : "In Progress",
                sequence    : 2,
                status      : "In Progress",
                wId         : "Leads",
                wName       : "lead",
                source      : "lead",
                targetSource: [
                    "lead"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce7f2f3f67bc40b000023",
                __v         : 0,
                attachments : [],
                name        : "In Progress",
                sequence    : 2,
                status      : "In Progress",
                wId         : "Projects",
                wName       : "project",
                source      : "project",
                targetSource: [
                    "project"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "5555bf276a3f01acae0b5561",
                name        : "Invoiced",
                sequence    : 2,
                status      : "Done",
                wId         : "Purchase Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "order"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "5555e5b9671a8b6800000004",
                sequence    : 2,
                status      : "Done",
                name        : "Paid",
                wId         : "Purchase Invoice",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "55647d982e4aa3804a765ecb",
                sequence    : 2,
                status      : "Done",
                name        : "Paid",
                wId         : "Sales Invoice",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528cdef4f3f67bc40b00000a",
                __v         : 0,
                attachments : [],
                name        : "Won",
                sequence    : 1,
                status      : "Done",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce3acf3f67bc40b000012",
                __v         : 0,
                attachments : [],
                name        : "Done",
                sequence    : 1,
                status      : "Done",
                wId         : "Tasks",
                wName       : "task",
                source      : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce700f3f67bc40b00001c",
                __v         : 0,
                attachments : [],
                name        : "No Recruitment",
                sequence    : 1,
                status      : "New",
                wId         : "Job positions",
                wName       : "jobposition",
                source      : "jobposition",
                targetSource: [
                    "jobposition"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce82df3f67bc40b000025",
                __v         : 0,
                attachments : [],
                name        : "Closed",
                sequence    : 1,
                status      : "Done",
                wId         : "Projects",
                wName       : "project",
                source      : "project",
                targetSource: [
                    "project"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "52b426b7c033b7e25ac4f91d",
                attachments : [],
                name        : "Closed",
                sequence    : 1,
                status      : "Done",
                wId         : "Leads",
                wName       : "lead",
                source      : "lead",
                targetSource: [
                    "lead"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "52d2c1369b57890814000005",
                __v         : 0,
                attachments : [],
                name        : "Contract End",
                sequence    : 1,
                status      : "Cancelled",
                wId         : "Applications",
                wName       : "",
                source      : "",
                targetSource: [
                    ""
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "55647b962e4aa3804a765ec6",
                name        : "Invoiced",
                sequence    : 1,
                status      : "Done",
                wId         : "Sales Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "order"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id     : "56599347bfd103f108eb4caa",
                sequence: 1,
                status  : "In Progress",
                name    : "Not Invoiced",
                wId     : "Purchase Order",
                __v     : 0,
                visible : true,
                color   : "#2C3E50"
            },
            {
                _id         : "528cdf1cf3f67bc40b00000b",
                __v         : 0,
                attachments : [],
                name        : "Lost",
                sequence    : 0,
                status      : "Cancelled",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce3caf3f67bc40b000013",
                __v         : 0,
                attachments : [],
                name        : "Cancelled",
                sequence    : 0,
                status      : "Cancelled",
                wId         : "Tasks",
                wName       : "task",
                source      : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce682f3f67bc40b00001a",
                __v         : 0,
                attachments : [],
                name        : "Refused",
                sequence    : 0,
                status      : "Cancelled",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce79bf3f67bc40b000020",
                __v         : 0,
                attachments : [],
                name        : "Cancelled",
                sequence    : 0,
                status      : "Cancelled",
                wId         : "Leads",
                wName       : "lead",
                source      : "lead",
                targetSource: [
                    "lead"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce80ef3f67bc40b000024",
                __v         : 0,
                attachments : [],
                name        : "Cancelled",
                sequence    : 0,
                status      : "Cancelled",
                wId         : "Projects",
                wName       : "project",
                source      : "project",
                targetSource: [
                    "project"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "555b09686ba860c41b000003",
                sequence    : 0,
                status      : "Cancelled",
                name        : "Cancelled",
                wId         : "Purchase Invoice",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce71ef3f67bc40b00001d",
                __v         : 0,
                attachments : [],
                name        : "Recruitement in Progress",
                sequence    : -1,
                status      : "In Progress",
                wId         : "Job positions",
                wName       : "jobposition",
                source      : "jobposition",
                targetSource: [
                    "jobposition"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id    : "56337c675d49d8d6537832ea",
                wId    : "Jobs",
                name   : "Finished",
                status : "Done",
                source : "jobs",
                visible: true,
                color  : "#2C3E50"
            },
            {
                _id    : "56337c705d49d8d6537832eb",
                wId    : "Jobs",
                name   : "In Progress",
                status : "In Progress",
                source : "jobs",
                visible: true,
                color  : "#2C3E50"
            }
        ]
    };
    var fakeStatuses = {
        data: [
            {
                _id        : 1,
                attachments: [],
                status     : "New"
            },
            {
                _id        : 2,
                attachments: [],
                status     : "In Progress"
            },
            {
                _id        : 3,
                attachments: [],
                status     : "Pending"
            },
            {
                _id        : 4,
                attachments: [],
                status     : "Done"
            },
            {
                _id        : 5,
                attachments: [],
                status     : "Cancelled"
            }
        ]
    };
    var expect;
    var view;
    var topBarView;
    var listView;
    var workflowCollection;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('WorkFlow View', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            topBarView.remove();
            listView.remove();
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

                server.respondWith('GET', '/modules/', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'Workflows'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="44"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="44"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Workflows');
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
                var workflowUrl = new RegExp('\/Workflows', 'i');

                server.respondWith('GET', workflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflows)]);

                workflowCollection = new WorkflowsCollection({
                    count      : 0,
                    page       : 1,
                    contentType: 'Workflows'

                });
                server.respond();

                topBarView = new TopBarView({
                    collection: workflowCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Workflows');
            });

        });

        describe('Workflows list view', function () {
            var server;
            var windowConfirmStub;
            var clock;
            var alertStub;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                view.remove();
                listView.remove();

                server.restore();
                windowConfirmStub.restore();
                alertStub.restore();
                clock.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create workflow list view', function (done) {
                    var $contentHolderEl;
                    var $workflowListEl;
                    var $workflowAccordEl;
                    var relatedStatusesUrl = new RegExp('\/workflows\/relatedStatus', 'i');

                    server.respondWith('GET', relatedStatusesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeStatuses)]);
                    listView = new ContentView({
                        collection: workflowCollection,
                        startTime : new Date()
                    });
                    server.respond();

                    clock.tick(200);

                    $contentHolderEl = view.$el.find('#content-holder');
                    $workflowListEl = $contentHolderEl.find('.workflow-list-wrapper');
                    $workflowAccordEl = $contentHolderEl.find('#workflowAccord');

                    expect($contentHolderEl).to.exist;
                    expect($workflowListEl).to.exist;
                    expect($workflowListEl).to.have.class('left');
                    expect($workflowAccordEl.find('#workflowNames').text().trim()).to.equals('');

                    topBarView.bind('createEvent', listView.createItem, listView);
                    topBarView.bind('deleteEvent', listView.deleteItems, listView);
                    topBarView.bind('saveEvent', listView.saveProfile, listView);

                    done();
                });

                it('Try to click li Applications', function () {
                    var $contentHolderEl;
                    var $workflowListEl;
                    var $workflowAccordEl;
                    var $needLiEl;
                    var workflowUrl = new RegExp('/Workflows', 'i');

                    $contentHolderEl = view.$el.find('#content-holder');
                    $workflowListEl = $contentHolderEl.find('.workflow-list-wrapper');
                    $workflowAccordEl = $contentHolderEl.find('#workflowAccord');
                    $needLiEl = $workflowListEl.find('li[data-id="Applications"]');

                    server.respondWith('GET', workflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflows)]);
                    $needLiEl.click();
                    server.respond();

                    expect($workflowAccordEl.find('#details').text().trim()).not.to.equals('');
                });

                it('Try to open editForm', function () {
                    var firstAccEl = $('.row')[0];
                    var $needAEl = $(firstAccEl).find('.edit');

                    $needAEl.click();

                    expect($(firstAccEl).find('span.name')).to.have.class('hidden');
                    expect($(firstAccEl).find('span.status')).to.have.class('hidden');
                    expect($(firstAccEl).find('input')).to.have.exist;
                    expect($(firstAccEl).find('select')).to.have.exist;
                });

                it('Try to edit item', function () {
                    var $firstAccEl = $('.row:nth-child(1)');
                    var $saveBtn = $firstAccEl.find('.save');
                    var $needInput = $firstAccEl.find('input');
                    var workflowUrl = new RegExp('\/workflows\/', 'i');

                    $needInput.val('Test workflow');
                    server.respondWith('PUT', workflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([{
                        'success': 'WorkFlow update success'
                    }])]);

                    $saveBtn.click();
                    server.respond();
                });

                it('Try to cancel edit', function () {
                    var $cancelBtn;
                    var $firstAccEl = $('.row:nth-child(1)');
                    var $needAEl = $firstAccEl.find('.edit');
                    var $needInput = $firstAccEl.find('input');

                    $needAEl.click();
                    $needInput.val('Test workflow');
                    $cancelBtn = $firstAccEl.find('.cancel');
                    $cancelBtn.click();

                    expect($firstAccEl.find('input').length).to.equals(0);
                });

                it('Try to delete item', function () {
                    var $firstEl = $('#workflows > div:nth-child(2)');
                    var $deleteBtn = $firstEl.find('.delete');
                    var workflowUrl = new RegExp('\/workflows\/', 'i');

                    server.respondWith('DELETE', workflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([{success: 'Delete success'}])]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('#workflows > div:nth-child(2) > div.name').attr('data-id')).to.be.equals('528ce53bf3f67bc40b000016');
                });

                it('Try to cancel new status', function () {
                    var $cancelStatus;
                    var $createBtn = listView.$el.find('#addNewStatus');

                    $createBtn.click();
                    expect(listView.$el.find('.addnew')).to.exist;

                    $cancelStatus = listView.$el.find('#cancelStatus');
                    $cancelStatus.click();

                    expect(listView.$el.find('.addnew')).to.not.exist;
                });

                it('Try to create new status', function (done) {
                    var workflowUrl = new RegExp('\/workflows\/', 'i');
                    var $createBtn = listView.$el.find('#addNewStatus');
                    var $saveBtn;
                    var $addedNew;
                    var $statusInput;

                    $createBtn.click();

                    $addedNew = listView.$el.find('.addnew');
                    $statusInput = $addedNew.find('input');

                    $statusInput.val('Super Test workflow');
                    $saveBtn = $addedNew.find('#saveStatus');

                    server.respondWith('POST', workflowUrl, [201, {'Content-Type': 'application/json'}, JSON.stringify([{
                        success     : 'A new WorkFlow crate success',
                        createdModel: {
                            _id     : '574c3e351f2d9f411ee93ffd',
                            sequence: 0,
                            status  : 'Pending',
                            name    : 'Super Test workflow',
                            visible : true
                        }
                    }])]);
                    $saveBtn.click();
                    server.respond();

                    clock.tick(200);

                    expect(window.location.hash).to.equals('#easyErp/Workflows');

                    done();
                });
            });
        });
    });
});
