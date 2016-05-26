define([
    'text!fixtures/index.html',
    'views/main/MainView',
    'views/Hours/index',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, MainView, IndexView, $, chai, chaiJquery, sinonChai, Custom) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [
        {
            "_id"        : 19,
            "attachments": [],
            "link"       : false,
            "mname"      : "Sales",
            "parrent"    : null,
            "sequence"   : 1,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Sales"
        }, {
            "_id"        : 36,
            "attachments": [],
            "link"       : false,
            "mname"      : "Project",
            "parrent"    : null,
            "sequence"   : 2,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Project"
        }, {
            "_id"        : 9,
            "attachments": [],
            "link"       : false,
            "mname"      : "HR",
            "parrent"    : null,
            "sequence"   : 3,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "HR"
        }, {
            "_id"        : 49,
            "attachments": [],
            "htref"      : "persons",
            "link"       : true,
            "mname"      : "Persons",
            "parrent"    : 19,
            "sequence"   : 7,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Persons"
        }, {
            "_id"        : 50,
            "attachments": [],
            "htref"      : "persons",
            "link"       : true,
            "mname"      : "Companies",
            "parrent"    : 19,
            "sequence"   : 8,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Companies"
        }, {
            "_id"        : 24,
            "attachments": [],
            "link"       : true,
            "mname"      : "Leads",
            "parrent"    : 19,
            "sequence"   : 9,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Leads"
        }, {
            "_id"        : 25,
            "attachments": [],
            "link"       : true,
            "mname"      : "Opportunities",
            "parrent"    : 19,
            "sequence"   : 10,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Opportunities"
        }, {
            "_id"        : 39,
            "attachments": [],
            "link"       : true,
            "mname"      : "Projects",
            "parrent"    : 36,
            "sequence"   : 23,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Projects"
        }, {
            "_id"        : 40,
            "attachments": [],
            "link"       : true,
            "mname"      : "Tasks",
            "parrent"    : 36,
            "sequence"   : 24,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Tasks"
        }, {
            "_id"        : 29,
            "attachments": [],
            "link"       : true,
            "mname"      : "Dashboard",
            "parrent"    : 19,
            "sequence"   : 29,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Dashboard"
        }, {
            "_id"        : 42,
            "attachments": [],
            "link"       : true,
            "mname"      : "Employees",
            "parrent"    : 9,
            "sequence"   : 29,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Employees"
        }, {
            "_id"        : 43,
            "attachments": [],
            "link"       : true,
            "mname"      : "Applications",
            "parrent"    : 9,
            "sequence"   : 30,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Applications"
        }, {
            "_id"        : 14,
            "attachments": [],
            "link"       : true,
            "mname"      : "Job Positions",
            "parrent"    : 9,
            "sequence"   : 32,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "JobPositions"
        }, {
            "_id"        : 15,
            "attachments": [],
            "link"       : true,
            "mname"      : "Groups",
            "parrent"    : 1,
            "sequence"   : 33,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Departments"
        }, {
            "_id"        : 7,
            "__v"        : 0,
            "attachments": [],
            "link"       : true,
            "mname"      : "Users",
            "parrent"    : 1,
            "sequence"   : 42,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Users"
        }, {
            "_id"        : 44,
            "attachments": [],
            "link"       : true,
            "mname"      : "Workflows",
            "parrent"    : 1,
            "sequence"   : 44,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Workflows"
        }, {
            "_id"        : 51,
            "attachments": [],
            "link"       : true,
            "mname"      : "Profiles",
            "parrent"    : 1,
            "sequence"   : 51,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Profiles"
        }, {
            "_id"        : 52,
            "attachments": [],
            "link"       : true,
            "mname"      : "Birthdays",
            "parrent"    : 9,
            "sequence"   : 52,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Birthdays"
        }, {
            "_id"        : 53,
            "attachments": [],
            "link"       : true,
            "mname"      : "Dashboard",
            "parrent"    : 36,
            "sequence"   : 53,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "projectDashboard"
        }, {
            "_id"      : 54,
            "mname"    : "Purchases",
            "sequence" : 54,
            "parrent"  : null,
            "link"     : false,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Purchases"
        }, {
            "_id"      : 80,
            "mname"    : "Jobs Dashboard",
            "sequence" : 54,
            "parrent"  : 36,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "jobsDashboard"
        }, {
            "_id"      : 55,
            "mname"    : "Quotation",
            "sequence" : 55,
            "parrent"  : 54,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Quotation"
        }, {
            "_id"      : 57,
            "mname"    : "Order",
            "sequence" : 56,
            "parrent"  : 54,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Order"
        }, {
            "_id"      : 56,
            "mname"    : "Invoice",
            "sequence" : 57,
            "parrent"  : 54,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Invoice"
        }, {
            "_id"      : 58,
            "mname"    : "Product",
            "sequence" : 58,
            "parrent"  : 54,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Product"
        }, {
            "_id"      : 59,
            "mname"    : "Accounting",
            "sequence" : 59,
            "parrent"  : null,
            "link"     : false,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Accounting"
        }, {
            "_id"      : 60,
            "mname"    : "Supplier Payments",
            "sequence" : 60,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "supplierPayments"
        }, {
            "_id"      : 61,
            "mname"    : "Customer Payments",
            "sequence" : 61,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "customerPayments"
        }, {
            "_id"      : 62,
            "mname"    : "Quotation",
            "sequence" : 62,
            "parrent"  : 19,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "salesQuotation"
        }, {
            "_id"      : 63,
            "mname"    : "Order",
            "sequence" : 63,
            "parrent"  : 19,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "salesOrder"
        }, {
            "_id"      : 64,
            "mname"    : "Invoice",
            "sequence" : 64,
            "parrent"  : 19,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "salesInvoice"
        }, {
            "_id"      : 68,
            "mname"    : "MonthHours",
            "sequence" : 68,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "monthHours"
        }, {
            "_id"      : 69,
            "mname"    : "Holidays",
            "sequence" : 69,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Holiday"
        }, {
            "_id"      : 77,
            "mname"    : "Capacity",
            "sequence" : 69,
            "parrent"  : 9,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Capacity"
        }, {
            "_id"      : 88,
            "mname"    : "Salary Report",
            "sequence" : 69,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "salaryReport"
        }, {
            "_id"      : 70,
            "mname"    : "Vacation",
            "sequence" : 70,
            "parrent"  : 9,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Vacation"
        }, {
            "_id"      : 71,
            "mname"    : "Attendance",
            "sequence" : 71,
            "parrent"  : 9,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Attendance"
        }, {
            "_id"      : 76,
            "mname"    : "Efficiency",
            "sequence" : 72,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Efficiency"
        }, {
            "_id"      : 72,
            "mname"    : "BonusType",
            "sequence" : 73,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "bonusType"
        }, {
            "_id"      : 74,
            "mname"    : "HrDashboard",
            "sequence" : 74,
            "parrent"  : 9,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "HrDashboard"
        }, {
            "_id"      : 66,
            "mname"    : "Payroll Expenses",
            "sequence" : 77,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "PayrollExpenses"
        }, {
            "_id"      : 78,
            "mname"    : "Payroll",
            "sequence" : 78,
            "parrent"  : null,
            "link"     : false,
            "visible"  : true,
            "ancestors": [],
            "href"     : "Payroll"
        }, {
            "_id"      : 79,
            "mname"    : "Payroll Payments",
            "sequence" : 79,
            "parrent"  : 78,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "PayrollPayments"
        }, {
            "_id"      : 82,
            "mname"    : "Invoice Aging",
            "sequence" : 82,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "invoiceAging"
        }, {
            "_id"      : 83,
            "mname"    : "ChartOfAccount",
            "sequence" : 83,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "ChartOfAccount"
        }, {
            "_id"      : 85,
            "mname"    : "Journal",
            "sequence" : 85,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "journal"
        }, {
            "_id"      : 86,
            "mname"    : "Journal Entry",
            "sequence" : 86,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "journalEntry"
        }, {
            "_id"      : 87,
            "mname"    : "Invoice Charts",
            "sequence" : 87,
            "parrent"  : 59,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "invoiceCharts"
        }, {
            "_id"        : 1,
            "__v"        : 0,
            "attachments": [],
            "link"       : false,
            "mname"      : "Settings",
            "parrent"    : null,
            "sequence"   : 1000,
            "visible"    : true,
            "ancestors"  : [],
            "href"       : "Settings"
        }, {
            "_id"      : 75,
            "mname"    : "tCard",
            "sequence" : 1000,
            "parrent"  : 36,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "wTrack"
        }, {
            "_id"      : 84,
            "mname"    : "Categories",
            "sequence" : 1000,
            "parrent"  : 1,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "productSettings"
        }, {
            "_id"      : 73,
            "mname"    : "DashBoardVacation",
            "sequence" : 1001,
            "parrent"  : 36,
            "link"     : true,
            "visible"  : true,
            "ancestors": [],
            "href"     : "DashBoardVacation"
        }];
    var fakeRevenue = {
        hoursSold  : [{
            employees  : [
                {
                    name     : "Oleksiy Gerasimov",
                    total    : 1539,
                    hoursSold: {
                        201502: 160,
                        201503: 29,
                        201504: 160,
                        201505: 104,
                        201506: 128,
                        201507: 104,
                        201508: 104,
                        201509: 36,
                        201510: 52,
                        201511: 118,
                        201512: 96,
                        201601: 120,
                        201602: 184,
                        201603: 144
                    }
                }
            ],
            name       : 'iOS',
            totalForDep: 51151
        }],
        totalHours : [{
            employees  : [
                {
                    name      : "Roman Osadchuk",
                    total     : 1448,
                    hoursTotal: {
                        201501: 160,
                        201502: 160,
                        201503: 160,
                        201504: 168,
                        201505: 144,
                        201506: 144,
                        201507: 184,
                        201508: 152,
                        201509: 176
                    }
                }
            ],
            name       : 'iOS',
            totalForDep: 60816
        }],
        hoursUnsold: [
            {
                name       : "iOS",
                employees  : [
                    {
                        name      : "Roman Osadchuk",
                        hoursTotal: {
                            201501: 160,
                            201502: 160,
                            201503: 160,
                            201504: 168,
                            201505: 144,
                            201506: 144,
                            201507: 184,
                            201508: 152,
                            201509: 176
                        },
                        total     : 1448
                    }
                ],
                totalForDep: 38153
            }
        ]
    };

    var view;
    var indexView;

    describe('Efficiency View', function () {

        var $fixture;
        var $elFixture;

        after(function () {
            indexView.remove();
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

            it('Should create main view', function (done) {
                var $expectedSubMenuEl;
                var $expectedMenuEl;

                setTimeout(function () {
                    server.respondWith('GET', '/getModules', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
                    view = new MainView({el: $elFixture, contentType: 'Efficiency'});
                    server.respond();

                    $expectedMenuEl = view.$el.find('#mainmenu-holder');
                    $expectedSubMenuEl = view.$el.find('#submenu-holder');

                    expect($expectedMenuEl).to.exist;
                    expect($expectedSubMenuEl).to.exist;

                    done();
                }, 300);

            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="76"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="76"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Efficiency');
            });

        });

        describe('Efficiency ListView', function () {
            var server;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to Efficiency ListView', function (done) {
                    var revenueUrl = new RegExp('\/revenue\/getFromCash', 'i');

                    this.timeout(5000);

                    server.respondWith('GET', revenueUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenue)]);
                    indexView = new IndexView();
                    server.respond();

                    clock.tick(4000);

                    expect(indexView.$el.find('.chartContainer')).to.have.exist;
                    expect(indexView.$el.find('#totalTotalHours')).to.have.exist;
                    expect(indexView.$el.find('#totalHoursSold')).to.have.exist;
                    expect(indexView.$el.find('#totalHoursUnsold')).to.have.exist;

                    done();
                });

                it('Try to change week', function () {
                    var $spinnerBtn = indexView.$el.find('.ui-spinner-button');
                    var revenueUrl = new RegExp('\/revenue\/getFromCash', 'i');

                    server.respondWith('GET', revenueUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeRevenue)]);
                    indexView.updateWeek();
                    server.respond();

                    expect(indexView.$el.find('.chartContainer')).to.have.exist;
                    expect(indexView.$el.find('#totalTotalHours')).to.have.exist;
                    expect(indexView.$el.find('#totalHoursSold')).to.have.exist;
                    expect(indexView.$el.find('#totalHoursUnsold')).to.have.exist;
                });

                it('Try to open department', function () {
                    var $needBtn = indexView.$el.find('.clickToShow')[0];

                    $needBtn.click();
                    expect($(indexView.$el.find('.subRow')[0])).to.have.css('display', 'table-row');

                    $needBtn.click();
                    expect($(indexView.$el.find('.subRow')[0])).to.have.css('display', 'none');
                });

            });
        });

    });


});
