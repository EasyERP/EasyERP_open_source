define([
    'text!fixtures/index.html',
    'collections/Jobs/filterCollection',
    'modules',
    'views/main/MainView',
    'views/jobsDashboard/list/ListView',
    'views/jobsDashboard/TopBarView',
    'views/Filter/filterView',
    'views/Projects/projectInfo/journalEntriesForJob/dialogView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom',
    'async'
], function (fixtures, JobsCollection, modules, MainView, ListView, TopBarView, FilterView, ReportView, eventsBinder, $, chai, chaiJquery, sinonChai, Custom, async) {
    'use strict';
    var expect;
    var fakeJobsDashboard = {
        total: 300,
        data : [
            {
                _id         : "564cfd8ba6e6390160c9ee23",
                total       : 834,
                order       : 1,
                name        : "iOS/Tribesta2-28/01/15",
                workflow    : {
                    _id   : "56337c675d49d8d6537832ea",
                    name  : "Finished",
                    status: "Done"
                },
                type        : "Invoiced",
                project     : {
                    _id : "55b92ad621e4b7c40f000687",
                    name: "iOS/Tribesta"
                },
                budget      : {
                    budgetTotal: {
                        minDate   : 201432,
                        maxDate   : 201444,
                        hoursSum  : 1424,
                        revenueSum: 1188000,
                        costSum   : 21960869
                    },
                    projectTeam: [
                        {
                            budget    : {
                                hoursSum  : 488,
                                revenueSum: 407123.59550561785,
                                costSum   : 4706464
                            },
                            employee  : {
                                name       : {
                                    first: "Michael",
                                    last : "Glagola"
                                },
                                jobPosition: {
                                    name: "Middle iOS",
                                    _id : "55b92acf21e4b7c40f00001d"
                                },
                                _id        : "55b92ad221e4b7c40f000076"
                            },
                            department: {
                                departmentName: "iOS",
                                _id           : "55b92ace21e4b7c40f00000f"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 168,
                                revenueSum: 140157.3033707865,
                                costSum   : 5204837
                            },
                            employee  : {
                                name       : {
                                    first: "Vasiliy",
                                    last : "Agosta"
                                },
                                jobPosition: {
                                    name: "Senior iOS",
                                    _id : "55b92acf21e4b7c40f000027"
                                },
                                _id        : "55b92ad221e4b7c40f00003a"
                            },
                            department: {
                                departmentName: "iOS",
                                _id           : "55b92ace21e4b7c40f00000f"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 120,
                                revenueSum: 100112.35955056178,
                                costSum   : 105714
                            },
                            employee  : {
                                name       : {
                                    first: "Vasiliy",
                                    last : "Cheypesh"
                                },
                                jobPosition: {
                                    name: "Middle JS",
                                    _id : "55b92acf21e4b7c40f00001c"
                                },
                                _id        : "55b92ad221e4b7c40f000062"
                            },
                            department: {
                                departmentName: "iOS",
                                _id           : "55b92ace21e4b7c40f00000f"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 472,
                                revenueSum: 393775.2808988765,
                                costSum   : 10048700
                            },
                            employee  : {
                                name       : {
                                    first: "Ilya",
                                    last : "Khymych"
                                },
                                jobPosition: {
                                    name: "Senior iOS",
                                    _id : "55b92acf21e4b7c40f000027"
                                },
                                _id        : "55b92ad221e4b7c40f000047"
                            },
                            department: {
                                departmentName: "iOS",
                                _id           : "55b92ace21e4b7c40f00000f"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 160,
                                revenueSum: 133483.1460674157,
                                costSum   : 1881058
                            },
                            employee  : {
                                name       : {
                                    first: "Anton",
                                    last : "Karabeinikov"
                                },
                                jobPosition: {
                                    name: "Junior QA",
                                    _id : "55b92acf21e4b7c40f000018"
                                },
                                _id        : "55b92ad221e4b7c40f00006f"
                            },
                            department: {
                                departmentName: "QA",
                                _id           : "55b92ace21e4b7c40f000011"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 16,
                                revenueSum: 13348.314606741573,
                                costSum   : 14096
                            },
                            employee  : {
                                name       : {
                                    first: "Vasiliy",
                                    last : "Cheypesh"
                                },
                                jobPosition: {
                                    name: "Middle JS",
                                    _id : "55b92acf21e4b7c40f00001c"
                                },
                                _id        : "55b92ad221e4b7c40f000062"
                            },
                            department: {
                                departmentName: "Web",
                                _id           : "55b92ace21e4b7c40f000016"
                            }
                        }
                    ]
                },
                quotation   : 1188000,
                invoice     : 1188000,
                payment     : {
                    paid : 1188000,
                    count: 1
                },
                hoursQA     : 160,
                hoursDesign : 0,
                hoursIOS    : 1248,
                hoursAndroid: 0,
                hoursUnity  : 0,
                hoursDotNet : 0,
                hoursWeb    : 16,
                hoursROR    : 0,
                hoursDev    : 1264,
                salesManager: {
                    _id : "55b92ad221e4b7c40f00004a",
                    name: {
                        last : "Ostroverkh",
                        first: "Oleg"
                    }
                },
                cost        : 1619548.1296717022,
                costQA      : 170174.47194496228,
                costDesign  : 0,
                costIOS     : 1257962.5452391286,
                costAndroid : 0,
                costUnity   : 0,
                costDotNet  : 0,
                costWeb     : 191411.1124876115,
                costROR     : 0,
                costDev     : 1449373.65772674,
                margin      : -36.325600140715665,
                devMargin   : -22.001149640297978,
                avDevRate   : 8.05241715233416,
                profit      : -4315.481296717022
            },
            {
                _id         : "564cfd8ba6e6390160c9eead",
                total      : 834,
                order      : 1,
                name       : "Oculus Player975/2015",
                workflow   : {
                    _id   : "56337c675d49d8d6537832ea",
                    name  : "Finished",
                    status: "Done"
                },
                type       : "Invoiced",
                project    : {
                    _id : "55b92ad621e4b7c40f00066f",
                    name: "Oculus Player"
                },
                budget     : {
                    budgetTotal: {
                        minDate   : 201514,
                        maxDate   : 201518,
                        hoursSum  : 1219,
                        revenueSum: 1585900.0000000005,
                        costSum   : 18476304
                    },
                    projectTeam: [
                        {
                            budget    : {
                                hoursSum  : 92,
                                revenueSum: 119588.00342759212,
                                costSum   : 1421618
                            },
                            employee  : {
                                name       : {
                                    first: "Vyacheslav",
                                    last : "Kopinets"
                                },
                                jobPosition: {
                                    name: "Senior JS",
                                    _id : "55b92acf21e4b7c40f00002b"
                                },
                                _id        : "55b92ad221e4b7c40f00004d"
                            },
                            department: {
                                departmentName: "Web",
                                _id           : "55b92ace21e4b7c40f000016"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 72,
                                revenueSum: 97844.73007712082,
                                costSum   : 35181
                            },
                            employee  : {
                                name       : {
                                    first: "Alex",
                                    last : "Lapchuk"
                                },
                                jobPosition: {
                                    name: "Junior JS",
                                    _id : "55b92acf21e4b7c40f000017"
                                },
                                _id        : "55b92ad221e4b7c40f00003e"
                            },
                            department: {
                                departmentName: "Web",
                                _id           : "55b92ace21e4b7c40f000016"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 176,
                                revenueSum: 228304.3701799486,
                                costSum   : 3900801
                            },
                            employee  : {
                                name       : {
                                    first: "Eugen",
                                    last : "Bernikevich"
                                },
                                jobPosition: {
                                    name: "Middle Unity 3D",
                                    _id : "55c32e2a29bd6ccd0b000006"
                                },
                                _id        : "55b92ad221e4b7c40f000072"
                            },
                            department: {
                                departmentName: ".NET/WP",
                                _id           : "55b92ace21e4b7c40f000012"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 176,
                                revenueSum: 228304.3701799486,
                                costSum   : 2306301
                            },
                            employee: {
                                name       : {
                                    first: "Daniil",
                                    last : "Pozhidaev"
                                },
                                jobPosition: {
                                    name: "Middle Android",
                                    _id : "55b92acf21e4b7c40f000022"
                                },
                                _id        : "55b92ad221e4b7c40f000070"
                            },
                            department: {
                                departmentName: "Android",
                                _id           : "55b92ace21e4b7c40f000010"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 143,
                                revenueSum: 183458.86889460153,
                                costSum   : 2815375
                            },
                            employee: {
                                name       : {
                                    first: "Denis",
                                    last : "Udod"
                                },
                                jobPosition: {
                                    name: "Middle Unity 3D",
                                    _id : "55c32e2a29bd6ccd0b000006"
                                },
                                _id        : "55b92ad221e4b7c40f000046"
                            },
                            department: {
                                departmentName: ".NET/WP",
                                _id           : "55b92ace21e4b7c40f000012"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 176,
                                revenueSum: 228304.37017994857,
                                costSum   : 2306301
                            },
                            employee: {
                                name       : {
                                    first: "Kirill",
                                    last : "Gorbushko"
                                },
                                jobPosition: {
                                    name: "Middle iOS",
                                    _id : "55b92acf21e4b7c40f00001d"
                                },
                                _id        : "55b92ad221e4b7c40f000085"
                            },
                            department: {
                                departmentName: "iOS",
                                _id           : "55b92ace21e4b7c40f00000f"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 16,
                                revenueSum: 21743.273350471296,
                                costSum   : 8836
                            },
                            employee: {
                                name       : {
                                    first: "Oleg",
                                    last : "Boyanivskiy"
                                },
                                jobPosition: {
                                    name: "Junior QA",
                                    _id : "55b92acf21e4b7c40f000018"
                                },
                                _id        : "55b92ad221e4b7c40f000078"
                            },
                            department: {
                                departmentName: "QA",
                                _id           : "55b92ace21e4b7c40f000011"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 16,
                                revenueSum: 21743.273350471296,
                                costSum   : 6291
                            },
                            employee: {
                                name       : {
                                    first: "German",
                                    last : "Kravets"
                                },
                                jobPosition: {
                                    name: "Junior JS",
                                    _id : "55b92acf21e4b7c40f000017"
                                },
                                _id        : "55b92ad221e4b7c40f00003d"
                            },
                            department: {
                                departmentName: "Web",
                                _id           : "55b92ace21e4b7c40f000016"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 176,
                                revenueSum: 228304.3701799486,
                                costSum   : 2837800
                            },
                            employee: {
                                name       : {
                                    first: "Michael",
                                    last : "Kapustey"
                                },
                                jobPosition: {
                                    name: "Middle JS",
                                    _id : "55b92acf21e4b7c40f00001c"
                                },
                                _id        : "55b92ad221e4b7c40f000049"
                            },
                            department: {
                                departmentName: ".NET/WP",
                                _id           : "55b92ace21e4b7c40f000012"
                            }
                        },
                        {
                            budget    : {
                                hoursSum  : 176,
                                revenueSum: 228304.3701799486,
                                costSum   : 2837800
                            },
                            employee: {
                                name       : {
                                    first: "Egor",
                                    last : "Gromadskiy"
                                },
                                jobPosition: {
                                    name: "Middle .NET/WP",
                                    _id : "56433d7c70bbc2b740ce8a15"
                                },
                                _id        : "55b92ad221e4b7c40f000066"
                            },
                            department: {
                                departmentName: ".NET/WP",
                                _id           : "55b92ace21e4b7c40f000012"
                            }
                        }
                    ]
                },
                quotation  : 1585900,
                invoice    : 1585900,
                payment    : {
                    paid : 1585900,
                    count: 1
                },
                hoursQA    : 16,
                hoursDesign: 0,
                hoursIOS   : 176,
                hoursAndroid: 176,
                hoursUnity  : 0,
                hoursDotNet : 671,
                hoursWeb    : 180,
                hoursROR    : 0,
                hoursDev    : 1203,
                salesManager: {
                    _id : "55b92ad221e4b7c40f00004a",
                    name: {
                        last : "Ostroverkh",
                        first: "Oleg"
                    }
                },
                cost        : 999706.0046065362,
                costQA      : 11466.901736309865,
                costDesign  : 0,
                costIOS     : 126135.91909940851,
                costAndroid : 0,
                costUnity   : 119509.24379207895,
                costDotNet  : 147088.30005178947,
                costWeb     : 280376.65887098975,
                costROR     : 0,
                costDev     : 988239.1028702263,
                margin      : 36.96285991509325,
                devMargin   : 37.68591318051414,
                avDevRate   : 13.087556926547716,
                profit      : 5861.939953934638
            }
        ]
    };
    var jobsCollection;
    var view;
    var topBarView;
    var listView;
    var selectSpy;
    var saveFilterSpy;
    var removeFilterSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('JobsDashboard View', function () {
        var $fixture;
        var $elFixture;
        var ajaxSpy;

        before(function () {
            ajaxSpy = sinon.spy($, 'ajax');
            selectSpy = sinon.spy(FilterView.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(FilterView.prototype, 'saveFilter');
        });

        after(function () {
            topBarView.remove();
            listView.remove();
            view.remove();
            ajaxSpy.restore();
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

                server.respondWith('GET', '/modules/', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'jobsDashboard'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="80"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="80"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/jobsDashboard');

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
                topBarView = new TopBarView({
                    actionType: 'Content'
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Jobs Dashboard');
            });

        });

        describe('jobsDashboard List view', function () {
            var $thisEl;
            var server;
            var mainSpy;
            var clock;
            var reportViewSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                reportViewSpy = sinon.spy(ReportView.prototype, 'initialize');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                reportViewSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ListView', function (done) {
                    var jobsDashboardUrl = new RegExp('\/jobs\/', 'i');
                    var $firstRow;
                    var colCount;
                    var $pagination;
                    var $pageList;
                    var elementsCount;

                    server.respondWith('GET', jobsDashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsDashboard)]);
                    jobsCollection = new JobsCollection({});
                    server.respond();

                    listView = new ListView({
                        startTime : new Date(),
                        collection: jobsCollection

                    });

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(jobsCollection, listView);

                    jobsCollection.trigger('fetchFinished', {
                        totalRecords: jobsCollection.totalRecords,
                        currentPage : jobsCollection.currentPage,
                        pageSize    : jobsCollection.pageSize
                    });
                    $thisEl = listView.$el;

                    clock.tick(200);
                    expect($thisEl.find('table')).to.exist;

                    elementsCount = $thisEl.find('#listTable > tr').length;
                    expect(elementsCount).to.be.equals(2);
                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;

                    expect(colCount).to.be.equals(33);

                    // test pagination
                    $pagination = $thisEl.find('.pagination');
                    expect($pagination).to.exist;
                    expect($pagination.find('.countOnPage')).to.exist;
                    expect($pagination.find('.pageList')).to.exist;
                    expect($pagination.find('.currentPageList')).to.exist;
                    $pageList = $pagination.find('#pageList');
                    expect($pageList).to.exist;
                    expect($pageList).to.have.css('display', 'none');

                    done();
                });

                it('Try to change page1 to page2', function () {
                    var $currentPageList = $thisEl.find('.currentPageList');
                    var ajaxResponse;
                    var $page2Btn;

                    ajaxSpy.reset();

                    $currentPageList.mouseover();
                    $page2Btn = $thisEl.find('#pageList > li').eq(1);
                    $page2Btn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];
                    expect(ajaxSpy.called).to.be.true;
                    expect(ajaxResponse).to.have.property('url', '/jobs/getForOverview');
                    expect(ajaxResponse.data).to.have.property('contentType').and.to.not.undefined;
                    expect(ajaxResponse.data).to.have.property('page', 2);
                });

                it('Try to select 25 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $pageList = $pagination.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(0);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '25');
                });

                it('Try to select 50 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $pageList = $pagination.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(1);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '50');
                });

                it('Try to select 100 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $pageList = $pagination.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(2);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '100');
                });

                it('Try to select 200 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $pageList = $pagination.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(3);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '200');
                });

                it('Try to go sort', function () {
                    var $sortEl = $thisEl.find('th[data-sort="payment.paid"]');
                    var jobsDashboardUrl = new RegExp('\/jobs\/', 'i');
                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('564cfd8ba6e6390160c9ee23');

                    server.respondWith('GET', jobsDashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify([fakeJobsDashboard.data[1], fakeJobsDashboard.data[0]])]);
                    $sortEl.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('564cfd8ba6e6390160c9eead');

                    server.respondWith('GET', jobsDashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsDashboard.data)]);
                    $sortEl.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('564cfd8ba6e6390160c9ee23');

                });

                it('Try to filter ListView by sales Manager', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var jobsDashboardUrl = new RegExp('\/jobs\/', 'i');
                    var $salesManager;
                    var elementsCount;
                    var $country;
                    var $selectedItem;
                    var $next;
                    var $prev;

                    selectSpy.reset();

                    // open filter dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                    // select fullName
                    $salesManager = $searchContainer.find('#salesManagerFullContainer .groupName');
                    $salesManager.click();
                    $selectedItem = $searchContainer.find('li[data-value="55b92ad221e4b7c40f00004f"]');

                    server.respondWith('GET', jobsDashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsDashboard)]);
                    $selectedItem.click();
                    server.respond();
                    expect(selectSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#searchContainer')).to.exist;
                    elementsCount = $thisEl.find('#listTable > tr').length;
                    expect(elementsCount).to.be.equals(2);

                });

                it('Try to save favorites filters', function () {
                    var userUrl = new RegExp('\/users\/', 'i');
                    var $searchContainer = $thisEl.find('#searchContainer');
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

                it('Try to delete salesManager filter', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $closeBtn = $searchContainer.find('span[data-value="salesManager"]').next();
                    var jobsDashboardUrl = new RegExp('\/jobs\/', 'i');
                    var elementsCount;

                    removeFilterSpy.reset();
                    server.respondWith('GET', jobsDashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeJobsDashboard)]);
                    $closeBtn.click();
                    server.respond();

                    expect(removeFilterSpy.called).to.be.true;
                    expect($thisEl).to.exist;
                    elementsCount = $thisEl.find('#listTable > tr').length;
                    expect(elementsCount).to.be.equals(2);
                });

                it('Try to open report', function () {
                    var $jobNameBtn = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(4) > a');
                    var journalEntryUrl = new RegExp('journalEntries\/getForReport', 'i');

                    server.respondWith('GET', journalEntryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({
                        data: {
                            wagesPayable: []
                        }
                    })]);
                    $jobNameBtn.click();
                    server.respond();

                    expect(reportViewSpy.called).to.be.true;
                    expect($('.ui-dialog')).to.exist;
                });
            });
        });
    });
});
