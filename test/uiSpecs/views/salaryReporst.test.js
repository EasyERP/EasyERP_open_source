define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/salaryReport/filterCollection',
    'views/main/MainView',
    'views/salaryReport/list/ListView',
    'views/salaryReport/TopBarView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    '../modules/filterTest'
], function (modules, fixtures, SalaryReportCollection, MainView, ListView, TopBarView, eventsBinder, $, chai, chaiJquery, sinonChai, FilterTest) {
    'use strict';

    var fakeSalaryReport = [
        {
            _id       : "55b92ad221e4b7c40f000098",
            department: ".NET/WP",
            name      : "Andriy Krupka",
            transfer  : [
                {
                    _id       : "55b92ad221e4b7c40f000098",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: false,
                    transfer  : {
                        date           : "2015-04-06T01:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 700,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "55b92acf21e4b7c40f00001a",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "hired"
                    },
                    lastFire  : 201614,
                    year      : 2015,
                    month     : 4,
                    hireDate  : 201504
                },
                {
                    _id       : "55b92ad221e4b7c40f000098",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: false,
                    transfer  : {
                        date           : "2015-06-01T00:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 800,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "55b92acf21e4b7c40f00001a",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "updated"
                    },
                    lastFire  : 201614,
                    year      : 2015,
                    month     : 6,
                    hireDate  : 201506
                },
                {
                    _id       : "55b92ad221e4b7c40f000098",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: false,
                    transfer  : {
                        date           : "2015-12-01T00:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 900,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "55b92acf21e4b7c40f00001a",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "updated"
                    },
                    lastFire  : 201614,
                    year      : 2015,
                    month     : 12,
                    hireDate  : 201512
                },
                {
                    _id       : "55b92ad221e4b7c40f000098",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: false,
                    transfer  : {
                        date           : "2016-01-01T00:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 1000,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "55b92acf21e4b7c40f00001a",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "updated"
                    },
                    lastFire  : 201614,
                    year      : 2016,
                    month     : 1,
                    hireDate  : 201601
                },
                {
                    _id       : "55b92ad221e4b7c40f000098",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: false,
                    transfer  : {
                        date           : "2016-02-01T00:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 1100,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "55b92acf21e4b7c40f00001a",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "updated"
                    },
                    lastFire  : 201614,
                    year      : 2016,
                    month     : 2,
                    hireDate  : 201602
                }
            ],
            lastFire  : 201614
        },
        {
            _id       : "55b92ad221e4b7c40f000032",
            department: ".NET/WP",
            name      : "Bogdan Sakalo",
            transfer  : [
                {
                    _id       : "55b92ad221e4b7c40f000032",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Sakalo",
                        first: "Bogdan"
                    },
                    isEmployee: false,
                    lastFire  : 201607,
                    transfer  : {
                        date           : "2013-12-02T02:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 350,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "56433d7c70bbc2b740ce8a15",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "hired"
                    },
                    year      : 2013,
                    month     : 12,
                    hireDate  : 201312
                },
                {
                    _id       : "55b92ad221e4b7c40f000032",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Sakalo",
                        first: "Bogdan"
                    },
                    isEmployee: false,
                    lastFire  : 201607,
                    transfer  : {
                        date           : "2014-10-01T00:00:00.000Z",
                        isDeveloper    : true,
                        info           : "Update",
                        salary         : 500,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "56433d7c70bbc2b740ce8a15",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "updated"
                    },
                    year      : 2014,
                    month     : 10,
                    hireDate  : 201410
                },
                {
                    _id       : "55b92ad221e4b7c40f000032",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Sakalo",
                        first: "Bogdan"
                    },
                    isEmployee: false,
                    lastFire  : 201607,
                    transfer  : {
                        date           : "2014-12-01T00:00:00.000Z",
                        isDeveloper    : true,
                        info           : "Update",
                        salary         : 600,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "56433d7c70bbc2b740ce8a15",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "updated"
                    },
                    year      : 2014,
                    month     : 12,
                    hireDate  : 201412
                },
                {
                    _id       : "55b92ad221e4b7c40f000032",
                    department: {
                        _id              : "55b92ace21e4b7c40f000012",
                        ID               : 4,
                        sequence         : 1,
                        nestingLevel     : 1,
                        editedBy         : {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy        : {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users            : [],
                        departmentManager: null,
                        parentDepartment : "56cebdf6541812c07197358f",
                        __v              : 0,
                        isDevelopment    : true,
                        name             : ".NET/WP"
                    },
                    name      : {
                        last : "Sakalo",
                        first: "Bogdan"
                    },
                    isEmployee: false,
                    lastFire  : 201607,
                    transfer  : {
                        date           : "2015-04-01T00:00:00.000Z",
                        isDeveloper    : true,
                        info           : "Update",
                        salary         : 800,
                        jobType        : "fullTime",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                        manager        : "55b92ad221e4b7c40f000038",
                        jobPosition    : "56433d7c70bbc2b740ce8a15",
                        department     : "55b92ace21e4b7c40f000012",
                        status         : "updated"
                    },
                    year      : 2015,
                    month     : 4,
                    hireDate  : 201504
                }
            ],
            lastFire  : 201607
        }
    ];
    var view;
    var topBarView;
    var listView;
    var expect;
    var salaryReportCollection;
    var ajaxSpy = sinon.spy($, 'ajax');
    var fakeFilters = {
        _id     : null,
        employee: [
            {
                _id       : "575fbc66c5d7fcf869b24c80",
                name      : "Ostap Opalinskiy",
                isEmployee: true
            },
            {
                _id       : "575829d7389dfb67764a4ab6",
                name      : "Ivan Margita",
                isEmployee: true
            }
        ],

        department: [
            {
                _id : "560c0b83a5d4a2e20ba5068c",
                name: "Finance"
            },
            {
                _id : "56e175c4d62294582e10ca68",
                name: "Unity"
            }
        ]
    };

    var filterOptions = {
        url        : '/salaryReport/',
        contentType: 'salaryReport'
    };
    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('SalaryReport View', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            selectFilterSpy = sinon.spy(FilterView.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(FilterView.prototype, 'saveFilter');
            ajaxSpy = sinon.spy($, 'ajax');
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');

            custom.removeFromCash('salaryReport.filter');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();
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
                view = new MainView({el: $elFixture, contentType: 'salaryReport'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;

            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="88"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="88"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salaryReport');
            });
        });

        describe('TopBarView', function () {
            var server;
            var consoleSpy;

            before(function () {
                server = sinon.fakeServer.create();
                consoleSpy = sinon.spy(console, 'log');
            });

            after(function () {
                server.restore();
                consoleSpy.restore();
            });

            it('Try to fetch collection with error', function () {
                var salaryReportUrl = new RegExp('\/salaryReport\/', 'i');

                server.respondWith('GET', salaryReportUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeSalaryReport)]);
                salaryReportCollection = new SalaryReportCollection();
                server.respond();

                expect(consoleSpy.called).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var salaryReportUrl = new RegExp('\/salaryReport\/', 'i');

                App.cashedData = {
                    salaryReportDateRange: {
                        startDate: '1 Jan, 2016',
                        endDate  : '1 Feb, 2016'
                    }
                };

                server.respondWith('GET', salaryReportUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeSalaryReport)]);
                salaryReportCollection = new SalaryReportCollection();
                server.respond();

                expect(salaryReportCollection).to.have.lengthOf(2);

                topBarView = new TopBarView({
                    collection: salaryReportCollection
                });

                expect(topBarView.$el.find('.vocationFilter')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Salary Report');
            });

        });

        describe('SalaryReport ListView', function () {
            var server;
            var $thisEl;
            var clock;
            var sortSpy;
            var changeDateRangeSpy;

            before(function () {
                App.currentViewType = 'list';
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                sortSpy = sinon.spy(ListView.prototype, 'goSort');
                changeDateRangeSpy = sinon.spy(ListView.prototype, 'changeDateRange');
            });

            after(function () {
                server.restore();
                clock.restore();
                sortSpy.restore();
                changeDateRangeSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create SalaryReportListView', function (done) {
                    var $firstRow;
                    var department;
                    var employee;
                    var filterUrl = '/filter/salaryReport';

                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
                    listView = new ListView({
                        collection: salaryReportCollection
                    });
                    server.respond();

                    clock.tick(200);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(salaryReportCollection, listView);

                    salaryReportCollection.trigger('fetchFinished', {
                        totalRecords: salaryReportCollection.totalRecords,
                        currentPage : salaryReportCollection.currentPage,
                        pageSize    : salaryReportCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.have.class('list');
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                    expect($thisEl.find('table tfoot')).to.exist;

                    $firstRow = $thisEl.find('#listTable > tr').first();

                    department = $firstRow.find('td:nth-child(2)').text().trim();
                    employee = $firstRow.find('td:nth-child(3)').text().trim();

                    expect(department).to.not.empty;
                    expect(department).to.not.match(/object Object|undefined/);

                    expect(employee).to.not.empty;
                    expect(employee).to.not.match(/object Object|undefined/);

                    done();
                });
                it('Try to sort list', function () {
                    var $employeeSortBtn = listView.$el.find('th[data-sort="name"]');
                    var salaryReportUrl = new RegExp('\/salaryReport\/', 'i');

                    sortSpy.reset();

                    server.respondWith('GET', salaryReportUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeSalaryReport)]);
                    $employeeSortBtn.click();
                    server.respond();
                    expect(sortSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('55b92ad221e4b7c40f000032');

                    server.respondWith('GET', salaryReportUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([
                        fakeSalaryReport[1],
                        fakeSalaryReport[0]
                    ])]);
                    $employeeSortBtn.click();
                    server.respond();
                    expect(sortSpy.calledTwice).to.be.true;
                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('55b92ad221e4b7c40f000098');
                });

                it('Try to change date range', function () {
                    var $startDate;
                    var $endDate;
                    var $updateDateBtn;
                    var $dateRangeEl = topBarView.$el.find('.dateRange');
                    var salaryReportUrl = new RegExp('\/salaryReport\/list', 'i');

                    changeDateRangeSpy.reset();

                    $dateRangeEl.click();

                    $startDate = topBarView.$el.find('#startDate');
                    $endDate = topBarView.$el.find('#endDate');

                    $startDate.val('1 Feb, 2016');
                    $startDate.trigger('onSelect');
                    $endDate.val('1 Mar, 2016');

                    $updateDateBtn = topBarView.$el.find('#updateDate');
                    server.respondWith('GET', salaryReportUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeSalaryReport)]);
                    $updateDateBtn.click();
                    server.respond();

                    expect(changeDateRangeSpy.calledOnce).to.be.true;
                    expect(window.location.hash).to.be.equals('#easyErp/salaryReport/list/p=1/c=100/');
                });

                // test filter view
                FilterTest(ajaxSpy, ['employee', 'department'], filterOptions, fakeSalaryReport, {});
            });
        });
    });
});

