/*
define([
    'modules',
    'text!fixtures/index.html',
    'collections/salaryReport/filterCollection',
    'views/main/MainView',
    'views/salaryReport/list/ListView',
    'views/salaryReport/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, SalaryReportCollection, MainView, ListView, TopBarView, $, chai, chaiJquery, sinonChai, Custom) {
    'use strict';

    var fakeSalaryReport = [
        {
            _id: "55b92ad221e4b7c40f000098",
            department: ".NET/WP",
            name: "Andriy Krupka",
            hire: [
                {
                    _id: "55b92ad221e4b7c40f000098",
                    hire: {
                        date: "2015-04-05T21:00:00.000Z",
                        info: "",
                        salary: 700,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f000038",
                        jobPosition: "55b92acf21e4b7c40f00001a",
                        department: "55b92ace21e4b7c40f000012"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000012",
                        ID: 4,
                        sequence: 1,
                        nestingLevel: 1,
                        editedBy: {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy: {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users: [],
                        departmentManager: null,
                        parentDepartment: "56cebdf6541812c07197358f",
                        departmentName: ".NET/WP",
                        __v: 0
                    },
                    name: {
                        last: "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: true,
                    year: 2015,
                    month: 4,
                    hireDate: 201504
                },
                {
                    _id: "55b92ad221e4b7c40f000098",
                    hire: {
                        date: "2015-06-05T21:00:00.000Z",
                        info: "",
                        salary: 800,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f000038",
                        jobPosition: "55b92acf21e4b7c40f00001a",
                        department: "55b92ace21e4b7c40f000012"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000012",
                        ID: 4,
                        sequence: 1,
                        nestingLevel: 1,
                        editedBy: {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy: {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users: [],
                        departmentManager: null,
                        parentDepartment: "56cebdf6541812c07197358f",
                        departmentName: ".NET/WP",
                        __v: 0
                    },
                    name: {
                        last: "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: true,
                    year: 2015,
                    month: 6,
                    hireDate: 201506
                },
                {
                    _id: "55b92ad221e4b7c40f000098",
                    hire: {
                        date: "2015-12-10T22:00:00.000Z",
                        info: "",
                        salary: 900,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f000038",
                        jobPosition: "55b92acf21e4b7c40f00001a",
                        department: "55b92ace21e4b7c40f000012"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000012",
                        ID: 4,
                        sequence: 1,
                        nestingLevel: 1,
                        editedBy: {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy: {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users: [],
                        departmentManager: null,
                        parentDepartment: "56cebdf6541812c07197358f",
                        departmentName: ".NET/WP",
                        __v: 0
                    },
                    name: {
                        last: "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: true,
                    year: 2015,
                    month: 12,
                    hireDate: 201512
                },
                {
                    _id: "55b92ad221e4b7c40f000098",
                    hire: {
                        date: "2015-12-31T22:00:00.000Z",
                        info: "",
                        salary: 1000,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f000038",
                        jobPosition: "55b92acf21e4b7c40f00001a",
                        department: "55b92ace21e4b7c40f000012"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000012",
                        ID: 4,
                        sequence: 1,
                        nestingLevel: 1,
                        editedBy: {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy: {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users: [],
                        departmentManager: null,
                        parentDepartment: "56cebdf6541812c07197358f",
                        departmentName: ".NET/WP",
                        __v: 0
                    },
                    name: {
                        last: "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: true,
                    year: 2015,
                    month: 12,
                    hireDate: 201512
                },
                {
                    _id: "55b92ad221e4b7c40f000098",
                    hire: {
                        date: "2016-01-31T22:00:00.000Z",
                        info: "",
                        salary: 1100,
                        jobType: "fullTime",
                        manager: "55b92ad221e4b7c40f000038",
                        jobPosition: "55b92acf21e4b7c40f00001a",
                        department: "55b92ace21e4b7c40f000012"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000012",
                        ID: 4,
                        sequence: 1,
                        nestingLevel: 1,
                        editedBy: {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy: {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users: [],
                        departmentManager: null,
                        parentDepartment: "56cebdf6541812c07197358f",
                        departmentName: ".NET/WP",
                        __v: 0
                    },
                    name: {
                        last: "Krupka",
                        first: "Andriy"
                    },
                    isEmployee: true,
                    year: 2016,
                    month: 1,
                    hireDate: 201601
                }
            ]
        }, {
            _id: "56d5a0c45132d292750a5e7e",
            department: ".NET/WP",
            name: "Rostyslav Ukrainskiy",
            hire: [
                {
                    _id: "56d5a0c45132d292750a5e7e",
                    lastFire: null,
                    hire: {
                        date: "2016-02-28T22:00:00.000Z",
                        info: "",
                        salary: 250,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f000098",
                        jobPosition: "55b92acf21e4b7c40f00002d",
                        department: "55b92ace21e4b7c40f000012"
                    },
                    department: {
                        _id: "55b92ace21e4b7c40f000012",
                        ID: 4,
                        sequence: 1,
                        nestingLevel: 1,
                        editedBy: {
                            date: "2016-02-25T08:40:48.233Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy: {
                            date: "2015-07-29T19:34:38.909Z",
                            user: "52203e707d4dba8813000003"
                        },
                        users: [],
                        departmentManager: null,
                        parentDepartment: "56cebdf6541812c07197358f",
                        departmentName: ".NET/WP",
                        __v: 0
                    },
                    name: {
                        last: "Ukrainskiy",
                        first: "Rostyslav"
                    },
                    isEmployee: true,
                    year: 2016,
                    month: 2,
                    hireDate: 201602
                }
            ],
            lastFire: null
        }
    ];
    var view;
    var topBarView;
    var listView;
    var expect;
    var salaryReportCollection;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('SalaryReport View', function () {
        var $fixture;
        var $elFixture;

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

                server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
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

            it('Try to fetch collection with error', function(){
                var salaryReportUrl = new RegExp('\/salaryReport\/list', 'i');

                server.respondWith('GET', salaryReportUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeSalaryReport)]);
                salaryReportCollection = new SalaryReportCollection();
                server.respond();

                expect(consoleSpy.called).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var salaryReportUrl = new RegExp('\/salaryReport\/list', 'i');

                App.cashedData = {
                    salaryReportDateRange: {
                        startDate: '1 Jan, 2016',
                        endDate  : '1 Feb, 2016'
                    }
                };

                server.respondWith('GET', salaryReportUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSalaryReport)]);
                salaryReportCollection = new SalaryReportCollection();
                server.respond();

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

            before(function () {
                App.currentViewType = 'list';
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create SalaryReportListView', function () {

                    listView = new ListView({
                        collection: salaryReportCollection
                    });

                    expect(listView.$el.find('table')).to.have.class('list');
                    expect(listView.$el.find('#listTable > tr').length).to.not.be.equals(0);
                    
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

                    salaryReportCollection.bind('showmore', listView.showMoreContent, listView);
                });

                it('Try to sort list', function () {
                    var $employeeSortBtn = listView.$el.find('th[data-sort="name"]');
                    var salaryReportUrl = new RegExp('\/salaryReport\/list', 'i');

                    server.respondWith('GET', salaryReportUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSalaryReport)]);
                    $employeeSortBtn.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('56d5a0c45132d292750a5e7e');

                    server.respondWith('GET', salaryReportUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeSalaryReport[1], fakeSalaryReport[0]])]);
                    $employeeSortBtn.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('55b92ad221e4b7c40f000098');

                });

                it('Try to change date range', function () {
                    var $startDate;
                    var $endDate;
                    var $updateDateBtn;
                    var $dateRangeEl = topBarView.$el.find('.dateRange');
                    var salaryReportUrl = new RegExp('\/salaryReport\/list', 'i');

                    $dateRangeEl.click();

                    $startDate = topBarView.$el.find('#startDate');
                    $endDate = topBarView.$el.find('#endDate');

                    $startDate.val('1 Feb, 2016');
                    $startDate.trigger('onSelect');
                    $endDate.val('1 Mar, 2016');

                    $updateDateBtn = topBarView.$el.find('#updateDate');
                    server.respondWith('GET', salaryReportUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeSalaryReport)]);
                    $updateDateBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/salaryReport');
                });
            });
        });
    });
});
*/
