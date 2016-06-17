define([
    'modules',
    'dashboardVacation',
    'text!fixtures/index.html',
    'collections/Dashboard/vacationDashboard',
    'views/main/MainView',
    'views/vacationDashboard/index',
    'views/vacationDashboard/TopBarView',
    'views/Filter/FilterView',
    'views/vacationDashboard/statisticsView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules,
             fakeDashBoardVacations,
             fixtures,
             DashBoardVacationCollection,
             MainView,
             IndexView,
             TopBarView,
             FilterView,
             StatisticsView,
             $,
             chai,
             chaiJquery,
             sinonChai) {
    'use strict';

    var fakeWTrackDash = {
        customer: {
            _id: "55cf4f834a91e37b0b000102",
            name: {
                last: "",
                first: "SharperBuilds"
            }
        },
        wTracks: [
            {
                1: 8,
                2: 8,
                3: 8,
                4: 8,
                5: 8,
                6: 0,
                7: 0,
                _id: "55b92ade21e4b7c40f000f93",
                cost: 26108.999999999996,
                worked: 40,
                week: 30,
                month: 7,
                year: 2015,
                dateByWeek: 201530,
                dateByMonth: 201507,
                info: {
                    salePrice: 67200,
                    productType: "wTrack"
                },
                revenue: 36513.96648044693,
                department: {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                employee: {
                    _id: "55b92ad221e4b7c40f00004d",
                    name: {
                        last: "Kopinets",
                        first: "Vyacheslav"
                    }
                },
                project: {
                    _id: "55b92ad621e4b7c40f0006c6",
                    EndDate: null,
                    StartDate: null,
                    ID: 2101,
                    bonus: [ ],
                    health: 1,
                    editedBy: {
                        date: "2016-05-12T12:29:12.146Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    attachments: [ ],
                    notes: [ ],
                    projecttype: "",
                    createdBy: {
                        date: "2015-07-29T19:34:46.406Z",
                        user: "52203e707d4dba8813000003"
                    },
                    progress: 0,
                    remaining: 0,
                    logged: 0,
                    estimated: 0,
                    workflow: "528ce82df3f67bc40b000025",
                    parent: null,
                    sequence: 0,
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW: "everyOne",
                    customer: "55cf4f834a91e37b0b000102",
                    task: [ ],
                    projectShortDesc: "emptyProject",
                    __v: 0,
                    teams: { },
                    info: { },
                    description: "",
                    budget: {
                        bonus: [ ],
                        projectTeam: [
                            "564cfd8ba6e6390160c9ef57",
                            "564cfd8ba6e6390160c9ef56",
                            "564cfdd06584412e618421a6"
                        ]
                    },
                    paymentTerms: "55536e52475b7be475f335f6",
                    paymentMethod: "565f2e05ab70d49024242e07",
                    name: "Demo Rocket"
                },
                jobs: {
                    _id: "564cfd8ba6e6390160c9ef57",
                    name: "Demo Rocket1137/2015"
                },
                _type: "ordinary",
                customer: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        last: "",
                        first: "SharperBuilds"
                    }
                }
            }
        ]
    };
    var fakeProjectWTrack = {
        data: [{
            _id: "56e689c75ec71b00429745a9",
            TargetEndDate: "2016-03-31T00:00:00.000Z",
            StartDate: null,
            budget: {
                projectTeam: [
                    "56e6f1ae0d773c634e918b68"
                ],
                bonus: [ ]
            },
            bonus: [ ],
            health: 1,
            editedBy: {
                date: "2016-03-14T16:19:02.059Z",
                user: "55b9fc0fd79a3a3439000008"
            },
            attachments: [ ],
            notes: [ ],
            projecttype: "iOs",
            createdBy: {
                date: "2016-03-14T09:52:07.280Z",
                user: "55b9fc0fd79a3a3439000008"
            },
            progress: 0,
            remaining: 0,
            logged: 0,
            estimated: 0,
            workflow: {
                _id: "528ce7f2f3f67bc40b000023",
                name: "In Progress"
            },
            parent: null,
            sequence: 0,
            groups: {
                owner: "560c099da5d4a2e20ba5068b",
                users: [ ],
                group: [ ]
            },
            whoCanRW: "everyOne",
            customer: {
                _id: "56a9eeabd59a04d6225b0df5",
                name: {
                    last: "Voloshchuk",
                    first: "Peter"
                }
            },
            task: [
                "5717661c2c8b789c7a0bb82d"
            ],
            projectShortDesc: "SDK",
            __v: 0,
            EndDate: null,
            paymentTerms: {
                _id: "55536e52475b7be475f335f6",
                name: "15 Days"
            },
            paymentMethod: "565f2e05ab70d49024242e07",
            name: "360CamSDK"
        },
            {
                _id: "5747f6df5c66305667bff462",
                TargetEndDate: "2016-06-09T22:00:00.000Z",
                StartDate: "2016-05-26T22:00:00.000Z",
                description: "3D modeling one person from the Kiss band The main idea - show to client our expertise and sell the new project",
                budget: {
                    projectTeam: [ ],
                    bonus: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-05-27T07:27:27.006Z",
                    user: "57332f3677b5a2435fa60989"
                },
                attachments: [ ],
                notes: [ ],
                paymentMethod: "565f2e05ab70d49024242e07",
                paymentTerms: {
                    _id: "55536e52475b7be475f335f6",
                    name: "15 Days"
                },
                projecttype: "fixed",
                createdBy: {
                    date: "2016-05-27T07:27:27.006Z",
                    user: "57332f3677b5a2435fa60989"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "57332f3677b5a2435fa60989",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "owner",
                customer: {
                    _id: "5717873cc6efb4847a5bc78c",
                    name: {
                        last: "",
                        first: "CEEK VR"
                    }
                },
                task: [ ],
                projectShortDesc: "Test task for the client",
                __v: 0,
                name: "3D ArtistModelling"
            },
            {
                _id: "571a079eb629a41976c9ac96",
                StartDate: "2016-03-15T23:00:00.000Z",
                description: "Windows app for creating bolus 3D models",
                budget: {
                    bonus: [ ],
                    projectTeam: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-05-25T12:17:34.773Z",
                    user: "52203e707d4dba8813000003"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: ".net",
                createdBy: {
                    date: "2016-04-22T11:14:38.051Z",
                    user: "56239dcce9576d1728a9ed1c"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                customer: {
                    _id: "55cf4f834a91e37b0b000102",
                    name: {
                        last: "",
                        first: "SharperBuilds"
                    }
                },
                task: [ ],
                projectShortDesc: "Peter Hickey",
                __v: 0,
                paymentTerms: {
                    _id: "55536e52475b7be475f335f6",
                    name: "15 Days"
                },
                paymentMethod: "565f2e05ab70d49024242e07",
                name: "3D Bolus (Windows)"
            },
            {
                _id: "573db3d09fdef3d14282b561",
                StartDate: "2016-04-30T22:00:00.000Z",
                budget: {
                    bonus: [ ],
                    projectTeam: [ ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-05-19T12:38:40.501Z",
                    user: "567181ae8453e8b464b70c19"
                },
                attachments: [ ],
                notes: [ ],
                paymentMethod: "565f2e05ab70d49024242e07",
                paymentTerms: {
                    _id: "55536e52475b7be475f335f6",
                    name: "15 Days"
                },
                projecttype: "fixed",
                createdBy: {
                    date: "2016-05-19T12:38:40.501Z",
                    user: "567181ae8453e8b464b70c19"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7d0f3f67bc40b000021",
                    name: "New"
                },
                parent: null,
                sequence: 0,
                groups: {
                    owner: "55b9fc0fd79a3a3439000008",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                customer: {
                    _id: "57347f7fa91aace5132deff9",
                    name: {
                        last: "",
                        first: "Digipresence"
                    }
                },
                task: [ ],
                projectShortDesc: "Abu-Dhabi Business Centre",
                __v: 0,
                name: "ADBC"
            },
            {
                _id: "569f60d162d172544baf0d58",
                StartDate: null,
                budget: {
                    bonus: [ ],
                    projectTeam: [
                        "570e030620a1ec3261f273a6",
                        "56fe8682ec814f7c039b804c",
                        "56f2530e5b26f346501c2e95",
                        "56cf1b6e541812c071973595",
                        "56c599c7d2b48ede4ba4224b",
                        "56e291d1896e98a661aa831c",
                        "56b4be1799ce8d706a81b2e0",
                        "569f624a62d172544baf0d5c",
                        "5759385aa169be136a9341b3"
                    ]
                },
                bonus: [ ],
                health: 1,
                editedBy: {
                    date: "2016-06-09T09:35:22.555Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2016-01-20T10:26:25.668Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: {
                    _id: "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                customer: {
                    _id: "569f5fbf62d172544baf0d56",
                    name: {
                        last: "",
                        first: "BIScience Ltd."
                    }
                },
                task: [ ],
                projectShortDesc: "Supportment of app",
                __v: 0,
                EndDate: null,
                TargetEndDate: "",
                description: "",
                paymentTerms: {
                    _id: "55536e52475b7be475f335f6",
                    name: "15 Days"
                },
                paymentMethod: "565f2e05ab70d49024242e07",
                name: "Android advertisement"
            }]
    };
    var fakeJobsForProject = [
        {
            _id: "56e6f1ae0d773c634e918b68",
            budget: {
                budgetTotal: {
                    costSum: 0,
                    revenueSum: 0,
                    hoursSum: 76,
                    maxDate: 201612,
                    minDate: 201611
                },
                budget: [ ],
                projectValues: [ ],
                projectTeam: [
                    {
                        department: {
                            _id: "55b92ace21e4b7c40f00000f",
                            name : "iOS"
                        },
                        employee: {
                            _id: "55b92ad221e4b7c40f000085",
                            jobPosition: {
                                _id: "55b92acf21e4b7c40f00001d",
                                name: "Middle iOS"
                            },
                            name: {
                                last: "Gorbushko",
                                first: "Kirill"
                            }
                        },
                        budget: {
                            costSum: 0,
                            revenueSum: 0,
                            hoursSum: 12
                        }
                    },
                    {
                        department: {
                            _id: "55b92ace21e4b7c40f00000f",
                            name : "iOS"
                        },
                        employee: {
                            _id: "55b92ad221e4b7c40f00007d",
                            jobPosition: {
                                _id: "55b92acf21e4b7c40f00001d",
                                name: "Middle iOS"
                            },
                            name: {
                                last: "Volskiy",
                                first: "Stas"
                            }
                        },
                        budget: {
                            costSum: 0,
                            revenueSum: 0,
                            hoursSum: 64
                        }
                    }
                ]
            },
            name: "March"
        }
    ];
    var fakeCustomerImage = {
        data: [
            {
                _id: "569f5fbf62d172544baf0d56",
                imageSrc: "data:image/jpeg;base64,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",
                fullName: "undefined undefined",
                id: "569f5fbf62d172544baf0d56"
            }
        ]
    }
    var expect;
    var view;
    var topBarView;
    var indexView;
    var selectSpy;
    var removeFilterSpy;
    var saveFilterSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('DashboardVacation', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            selectSpy = sinon.spy(FilterView.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(FilterView.prototype, 'saveFilter');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            indexView.remove();
            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
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
                view = new MainView({el: $elFixture, contentType: 'DashBoardVacation'});
                server.respond();

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
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dashboard Vacation');
            });
        });

        describe('DashBoard IndexView', function () {
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

                    this.timeout(20000);

                    server.respondWith('GET', dashBoardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDashBoardVacations)]);
                    indexView = new IndexView({
                        startTime: new Date()
                    });

                    server.respond();
                    clock.tick(19000);
                    $thisEl = indexView.$el;

                    expect($thisEl.find('.dashBoardMargin')).to.exist;

                    done();
                });

                it('Try to filter ThumbnailsView by Employee', function () {
                    var $searchContainer = topBarView.$el.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var dashBoardUrl = new RegExp('dashboard\/vacation', 'i');
                    var $employee;
                    var $country;
                    var $selectedItem;
                    var $next;
                    var $prev;
                    this.timeout(10000);

                    selectSpy.reset();

                    // open filter dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                    // select fullName
                    $employee = $searchContainer.find('#nameFullContainer .groupName');
                    $employee.click();
                    $selectedItem = $searchContainer.find('li[data-value="564dac3e9b85f8b16b574fea"]');

                    server.respondWith('GET', dashBoardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDashBoardVacations)]);
                    $selectedItem.click();
                    server.respond();
                    expect(selectSpy.calledOnce).to.be.true;
                    expect(topBarView.$el.find('#searchContainer')).to.exist;

                });

                it('Try to save favorites filters', function () {
                    var userUrl = new RegExp('\/users\/', 'i');
                    var $searchContainer = topBarView.$el.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $favoritesBtn = $searchContainer.find('li[data-value="#favoritesContent"]');
                    var $filterNameInput;
                    var $saveFilterBtn;

                    saveFilterSpy.reset();

                    $favoritesBtn.click();
                    expect($searchContainer.find('#filtersContent')).to.have.class('hidden');

                    $filterNameInput = $searchContainer.find('#forFilterName');
                    $filterNameInput.val('Test');
                    $saveFilterBtn = $searchContainer.find('#saveFilterButton');

                    server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveFilterBtn.click();
                    server.respond();
                    expect(saveFilterSpy.called).to.be.true;

                    //close filter dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.class('hidden');
                });

                it('Try to delete Employee filter', function () {
                    var $searchContainer = topBarView.$el.find('#searchContainer');
                    var $closeBtn = $searchContainer.find('span[data-value="name"]').next();
                    var dashBoardUrl = new RegExp('dashboard\/vacation', 'i');
                    this.timeout(10000);

                    removeFilterSpy.reset();

                    server.respondWith('GET', dashBoardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDashBoardVacations)]);
                    $closeBtn.click();
                    server.respond();

                    expect(removeFilterSpy.called).to.be.true;
                    expect($thisEl).to.exist;
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

                    server.respondWith('GET', dashBoardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDashBoardVacations)]);
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

                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProjectWTrack)]);
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

                it('Try to create tCard', function () {
                    var $needLiEl;
                    var $chooseGroupBtn;
                    var jobsUrl = new RegExp('\/jobs\/getForDD', 'i');
                    var customerImagesUrl = new RegExp('\/customers\/getCustomersImages', 'i');
                    var $select;
                    var $jobsTd;
                    var generateJob;


                    var $dialogEl = $('.ui-dialog');
                    var $row = $dialogEl.find('#wTrackCreateTable tr:nth-child(1)');
                    var $typeTcard = $dialogEl.find('#wTrackCreateTable td:nth-child(1)');
                    var $mondayTd = $dialogEl.find('#wTrackCreateTable td:nth-child(9)');
                    var $jobsTd = $dialogEl.find('td[data-content="jobs"]');
                    var $project = $dialogEl.find('#project');
                    var keyDownEvent = $.Event('keydown');
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
                    server.respondWith('GET', jobsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsForProject)]);
                    server.respondWith('GET', customerImagesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerImage)]);
                    $select.click();
                    server.respond();
                    server.respond();

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

                    //  $chooseGroupBtn.click();

                    //expect($('.ui-dialog')).to.not.exist;

                });

                it('Try to generate Job in createView wTrack', function (done){
                    var $generateJob;
                    var $dialogEl = $('.ui-dialog');
                    var $jobsTd;
                    var $nameInput;
                    var $saveButton;
                    var jobsUrl = new RegExp('\/jobs\/', 'i');

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

                it('Try to save tCard in createView', function (done){
                    var $dialogEl = $('.ui-dialog');
                    var $saveButton;
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    $saveButton = $dialogEl.find('div.ui-dialog-buttonpane button:nth-child(1)');

                    // generate Job
                    server.respondWith('POST', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveButton.click();
                    server.respond();
                    done();
                });


/*
                it('Try to get Wtrack Info with error', function (done) {
                    var wTrackUrl = new RegExp('\/wTrack\/dash', 'i');
                    var $needEmployeeRow = indexView.$el.find('#dashboardBody > tr[data-id="55b92ad221e4b7c40f00004d"] .employeesRow');
                    var vacationUrl = new RegExp('\/vacation\/list', 'i');
                    var holidayUrl = new RegExp('\/holiday\/list', 'i');
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
                    expect(mainSpy.calledThrice).to.be.true;
                    spyResponse = mainSpy.args[2][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Bad Request');

                    done();
                });

                it('Try to get Wtrack Info', function () {
                    var wTrackUrl = new RegExp('\/wTrack\/dash', 'i');
                    var $needEmployeeRow = indexView.$el.find('#dashboardBody > tr[data-id="55b92ad221e4b7c40f00004d"] .employeesRow');
                    var vacationUrl = new RegExp('\/vacation\/list', 'i');
                    var holidayUrl = new RegExp('\/holiday\/list', 'i');
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

                    server.respondWith('GET', vacationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    server.respondWith('GET', holidayUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    server.respondWith('GET', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWTrackDash)]);
                    $wTrackInfoEl.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.be.exist;
                });

                it('Try to edit wTrackInfo', function () {
                    var $dialogEl = $('.ui-dialog');
                    var $wednesdayInput;
                    var $saveBtn;
                    var $needTr = $dialogEl.find('tr[data-id="56efcd99371928ed3349003b"]');
                    var $wednesdayEl = $needTr.find('td[data-content="3"]');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');
                    var $wTrackInfoEl = $(indexView.$el.find('#dashboardBody > tr[data-employee="55b92ad221e4b7c40f00004d"] > td.wTrackInfo')[0]);

                    $wednesdayEl.click();
                    $wednesdayInput = $wednesdayEl.find('input');
                    $wednesdayInput.val(8);
                    $wednesdayInput.click();

                    $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    server.respondWith('PATCH', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Edited success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect($wTrackInfoEl.find('.projectHours').text()).to.be.equals('39');
                    $('.ui-dialog').remove();
                });*/
            });
        });
    });
});
