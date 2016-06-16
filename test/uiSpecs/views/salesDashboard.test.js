define([
    'text!fixtures/index.html',
    'views/main/MainView',
    'views/Dashboard/ContentView',
    'views/Dashboard/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, MainView, ContentView, TopBarView, $, chai, chaiJquery, sinonChai, Custom) {
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
            "href": "salesInvoice"
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
    var fakeDashBoardData = {
        data: [
            {
                count: 1,
                date: [
                    "2016-03-02T16:21:29.580Z"
                ],
                source: 2,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-03-03T01:13:55.644Z"
                ],
                source: 3,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-03-04T08:29:16.130Z"
                ],
                source: 4,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-04-05T08:39:48.972Z"
                ],
                source: 5,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-04-06T06:48:16.093Z"
                ],
                source: 6,
                isOpp: false
            },
            {
                count: 8,
                date: [
                    "2016-03-07T08:45:56.321Z",
                    "2016-03-07T08:55:22.114Z",
                    "2016-03-07T09:02:19.863Z",
                    "2016-03-07T09:14:10.897Z",
                    "2016-03-07T09:42:49.316Z",
                    "2016-03-07T09:48:43.690Z",
                    "2016-03-07T10:00:00.637Z",
                    "2016-03-07T11:15:10.663Z"
                ],
                source: 7,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-04-08T07:05:49.924Z"
                ],
                source: 8,
                isOpp: false
            },
            {
                count: 2,
                date: [
                    "2016-02-09T08:46:52.384Z",
                    "2016-03-09T17:43:44.799Z"
                ],
                source: 9,
                isOpp: false
            },
            {
                count: 2,
                date: [
                    "2016-03-14T10:03:44.385Z",
                    "2016-03-14T14:13:22.337Z"
                ],
                source: 14,
                isOpp: false
            },
            {
                count: 2,
                date: [
                    "2016-02-15T12:29:28.885Z",
                    "2016-02-15T12:30:36.031Z"
                ],
                source: 15,
                isOpp: false
            },
            {
                count: 4,
                date: [
                    "2016-02-18T06:38:18.275Z",
                    "2016-02-18T19:33:30.930Z",
                    "2016-03-18T14:36:22.552Z",
                    "2016-03-18T14:37:48.940Z"
                ],
                source: 18,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-02-19T08:09:13.126Z"
                ],
                source: 19,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-03-22T09:28:46.154Z"
                ],
                source: 22,
                isOpp: true
            },
            {
                count: 2,
                date: [
                    "2016-03-23T08:17:47.340Z",
                    "2016-03-23T13:38:01.808Z"
                ],
                source: 23,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-02-24T19:08:27.812Z"
                ],
                source: 24,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-02-26T08:42:01.410Z"
                ],
                source: 26,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-03-28T08:53:48.129Z"
                ],
                source: 28,
                isOpp: false
            },
            {
                count: 1,
                date: [
                    "2016-03-31T16:27:49.274Z"
                ],
                source: 31,
                isOpp: false
            }
        ]
    };
    var fakeEmployeesSource = {
        data: [
            {
                _id: "bing",
                attachments: [],
                name: "Bing"
            },
            {
                _id: "email",
                attachments: [],
                name: "Email"
            },
            {
                _id: "google",
                attachments: [],
                name: "Google"
            },
            {
                _id: "linkedin",
                attachments: [],
                name: "LinkedIn"
            },
            {
                _id: "other",
                attachments: [],
                name: "Other"
            },
            {
                _id: "upwork",
                attachments: [],
                name: "Upwork"
            },
            {
                _id: "victor",
                attachments: [],
                name: "Victor"
            },
            {
                _id: "website",
                attachments: [],
                name: "Website"
            }
        ]
    };

    var view;
    var topBarView;
    var contentView;

    describe('SalesDashboardView', function () {

        var $fixture;
        var $elFixture;

        after(function () {
           /* topBarView.remove();
            contentView.remove();
            view.remove();*/
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
                view = new MainView({el: $elFixture, contentType: 'Dashboard'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;

            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="29"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="29"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Dashboard');

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

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dashboard');
            });

        });

        describe('SalaryReport ListView', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create DashboardView', function () {
                    var dashboardUrl = new RegExp('\/leads\/getLeadsForChart', 'i');
                    var employeesSourceUrl = '/employees/sources';

                    server.respondWith('GET', dashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDashBoardData)]);
                    server.respondWith('GET', employeesSourceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeesSource)]);
                    contentView = new ContentView({
                        startTime: new Date()
                    });
                    $(window).trigger('resize');
                    server.respond();
                    server.respond();

                    expect(contentView.$el.find('.chart-tabs')).to.exist;
                    expect(contentView.$el.find('.chart-tabs-items')).to.exist;
                });

                it('Try to change tab', function(){
                    var $chartTabs = contentView.$el.find('.chart-tabs');
                    var $firstTab = $chartTabs.find('li:nth-child(1) > a');
                    var $secondTab = $chartTabs.find('li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($chartTabs.find('li:nth-child(2) > a')).to.have.class('active');

                    $firstTab.click();
                    expect($chartTabs.find('li:nth-child(1) > a')).to.have.class('active');
                });

                it('Try to choose date range', function(){
                    var $chooseDateRange = contentView.$el.find('.choseDateRange');
                    var $firstItem = $chooseDateRange.find('.item:nth-child(1)');
                    var $secondItem = $chooseDateRange.find('.item:nth-child(2)');
                    var $thirdItem = $chooseDateRange.find('.item:nth-child(3)');
                    var $foursItem = $chooseDateRange.find('.item:nth-child(4)');
                    var dashboardUrl = new RegExp('\/leads\/getLeadsForChart', 'i');
                    var employeesSourceUrl = '/employees/sources';

                    server.respondWith('GET', dashboardUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeDashBoardData)]);
                    server.respondWith('GET', employeesSourceUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeEmployeesSource)]);
                    $firstItem.click();
                    server.respond();
                    server.respond();

                    $secondItem.click();
                    server.respond();
                    server.respond();

                    $thirdItem.click();
                    server.respond();
                    server.respond();

                    $foursItem.click();
                    server.respond();
                    server.respond();

                    expect(contentView.$el.find('.chart-tabs')).to.exist;
                    expect(contentView.$el.find('.chart-tabs-items')).to.exist;
                });

                it('Try to choose date item', function(){
                    var $dateItem = contentView.$el.find('.choseDateItem');
                    var $firstItem = $dateItem.find('.item:nth-child(1)');
                    var $secondItem = $dateItem.find('.item:nth-child(2)');
                    var $thirdItem = $dateItem.find('.item:nth-child(3)');
                    var $foursItem = $dateItem.find('.item:nth-child(4)');
                    var $fifthItem = $dateItem.find('.item:nth-child(4)');

                    $firstItem.click();
                    server.respond();
                    server.respond();

                    $secondItem.click();
                    server.respond();
                    server.respond();

                    $thirdItem.click();
                    server.respond();
                    server.respond();

                    $foursItem.click();
                    server.respond();
                    server.respond();

                    $fifthItem.click();
                    server.respond();
                    server.respond();

                    expect(contentView.$el.find('.chart-tabs')).to.exist;
                    expect(contentView.$el.find('.chart-tabs-items')).to.exist;
                });

                it('Try to choose date range source', function(){
                    var $chartTabs = contentView.$el.find('.chart-tabs');
                    var $secondTab = $chartTabs.find('li:nth-child(2) > a');
                    var $chooseDateRange = contentView.$el.find('.choseDateRangeSource');
                    var $firstItem = $chooseDateRange.find('.item:nth-child(1)');
                    var $secondItem = $chooseDateRange.find('.item:nth-child(2)');
                    var $thirdItem = $chooseDateRange.find('.item:nth-child(3)');
                    var $foursItem = $chooseDateRange.find('.item:nth-child(4)');
                    var dashboardUrl = new RegExp('\/leads\/getLeadsForChart', 'i');
                    var employeesSourceUrl = '/employees/sources';

                    $secondTab.click();

                    $firstItem.click();
                    server.respond();
                    server.respond();

                    $secondItem.click();
                    server.respond();
                    server.respond();

                    $thirdItem.click();
                    server.respond();
                    server.respond();

                    $foursItem.click();
                    server.respond();
                    server.respond();

                    expect(contentView.$el.find('.chart-tabs')).to.exist;
                    expect(contentView.$el.find('.chart-tabs-items')).to.exist;
                });

            });
        });

    });


});
