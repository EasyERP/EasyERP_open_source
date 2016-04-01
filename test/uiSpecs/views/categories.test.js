/*
define([
    'text!fixtures/index.html',
    'collections/Product/ProductCategories',
    'views/main/MainView',
    'views/settingsProduct/ContentView',
    'views/settingsProduct/TopBarView',
    'views/settingsProduct/CreateView',
    'views/settingsProduct/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (fixtures, CategoriesCollection, MainView, ContentView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai, Custom) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var modules = [{
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
        "mname": "Quotation",
        "sequence": 55,
        "parrent": 54,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "Quotation"
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
        "mname": "Quotation",
        "sequence": 62,
        "parrent": 19,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salesQuotation"
    }, {
        "_id": 63,
        "mname": "Order",
        "sequence": 63,
        "parrent": 19,
        "link": true,
        "visible": true,
        "ancestors": [],
        "href": "salesOrder"
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

    var fakeCategories = {
        data: [
            {
                _id: "564591f9624e48551dfe3b23",
                __v: 0,
                sequence: 0,
                nestingLevel: null,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:32:09.792Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                parent: null,
                fullName: "All",
                name: "All"
            },
            {
                _id: "56459202624e48551dfe3b24",
                __v: 0,
                sequence: 0,
                nestingLevel: null,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:32:18.495Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                parent: {
                    _id: "564591f9624e48551dfe3b23",
                    __v: 0,
                    sequence: 0,
                    nestingLevel: null,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-11-13T07:32:09.792Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    parent: null,
                    fullName: "All",
                    name: "All"
                },
                fullName: "All / Expenses",
                name: "Expenses"
            },
            {
                _id: "5645925f624e48551dfe3b26",
                __v: 0,
                sequence: 1,
                nestingLevel: null,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:33:51.900Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                parent: {
                    _id: "56459202624e48551dfe3b24",
                    __v: 0,
                    sequence: 0,
                    nestingLevel: null,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    parent: "564591f9624e48551dfe3b23",
                    fullName: "All / Expenses",
                    name: "Expenses"
                },
                fullName: "All / Expenses / Bonus Card",
                name: "Bonus Card"
            },
            {
                _id: "5645920f624e48551dfe3b25",
                __v: 0,
                sequence: 6,
                nestingLevel: null,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:32:31.085Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                parent: {
                    _id: "56459202624e48551dfe3b24",
                    __v: 0,
                    sequence: 0,
                    nestingLevel: null,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    parent: "564591f9624e48551dfe3b23",
                    fullName: "All / Expenses",
                    name: "Expenses"
                },
                fullName: "All / Expenses / Bonus Cash",
                name: "Bonus Cash"
            },
            {
                _id: "56459308abb1c35728ad7d10",
                __v: 0,
                sequence: 5,
                nestingLevel: 2,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:36:40.347Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                parent: {
                    _id: "56459202624e48551dfe3b24",
                    __v: 0,
                    sequence: 0,
                    nestingLevel: null,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    parent: "564591f9624e48551dfe3b23",
                    fullName: "All / Expenses",
                    name: "Expenses"
                },
                fullName: "All / Expenses / Salary Card",
                name: "Salary Card"
            },
            {
                _id: "564592fbabb1c35728ad7d0f",
                __v: 0,
                sequence: 0,
                nestingLevel: 1,
                editedBy: {
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-11-13T07:36:27.099Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                parent: {
                    _id: "56459202624e48551dfe3b24",
                    __v: 0,
                    sequence: 0,
                    nestingLevel: null,
                    editedBy: {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users: [ ],
                    parent: "564591f9624e48551dfe3b23",
                    fullName: "All / Expenses",
                    name: "Expenses"
                },
                fullName: "All / Expenses / Salary Cash",
                name: "Salary Cash"
            }
        ]
    };

    var fakeCategoryById = {
        _id: "564591f9624e48551dfe3b23",
        __v: 0,
        sequence: 0,
        nestingLevel: null,
        editedBy: {
            user: "52203e707d4dba8813000003"
        },
        createdBy: {
            date: "2015-11-13T07:32:09.792Z",
            user: "52203e707d4dba8813000003"
        },
        users: [ ],
        parent: null,
        fullName: "All",
        name: "All"
    };

    var view;
    var topBarView;
    var listView;
    var categoriesCollection;

    describe('CategoriesView', function () {
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

                view = new MainView({el: $elFixture, contentType: 'productSettings'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="84"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="84"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/productSettings');

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
                var categoryUrl = new RegExp('\/category\/', 'i');

                server.respondWith('GET', categoryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCategories)]);
                categoriesCollection = new CategoriesCollection({
                    count: 0,
                    page: 1,
                    contentType: 'productSettings'

                });
                server.respond();

                topBarView = new TopBarView({
                    collection: categoriesCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Product Categories');
            });

        });


        describe('Profiles list view', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create categories list view', function () {

                    listView = new ContentView({
                        collection: categoriesCollection,
                        startTime: new Date()
                    });

                    expect(listView.$el.find('#groupList')).to.exist;

                });

                it('Try to delete item from list with error 403', function () {
                    var spyResponse;
                    var $deleteBtn = listView.$el.find('#groupList  li[data-id="56459308abb1c35728ad7d10"] .trash')[0];
                    var categoryUrl = new RegExp('\/category\/', 'i');

                    server.respondWith('DELETE', categoryUrl, [403, {"Content-Type": "application/json"}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();
                    spyResponse = mainSpy.args[0][0];

                    expect(spyResponse).to.have.property('type', 'error');

                });

                it('Try to delete item from list', function () {
                    var $deleteBtn = listView.$el.find('#groupList  li[data-id="56459308abb1c35728ad7d10"] .trash')[0];
                    var categoryUrl = new RegExp('\/category\/', 'i');

                    server.respondWith('DELETE', categoryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Deleted success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/productSettings');

                });

                it('Try to open EditForm', function(){
                    var categoryByIdUrl = '/category/564591f9624e48551dfe3b23';
                    var categoryUrl = '/category';
                    var $needLi = listView.$el.find('#groupList > li:nth-child(1)');

                    server.respondWith('GET', categoryByIdUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCategoryById)]);
                    server.respondWith('GET', categoryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCategories)]);
                    $needLi.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to edit item', function(){
                    var $select;
                    var $dialogEl = $('.ui-dialog');
                    var $categoryName = $dialogEl.find('#categoryName');
                    var $categorySelect = $dialogEl.find('#parentCategory');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)')
                    var categoryUrl = new RegExp('\/category\/', 'i');

                    $categoryName.val('Test');
                    $categorySelect.click();
                    $select = $dialogEl.find('#56459202624e48551dfe3b24');
                    $select.click();

                    server.respondWith('PUT', categoryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/productSettings');
                });

                it('Try to delete current category', function(){
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)')
                    var categoryUrl = new RegExp('\/category\/', 'i');

                    server.respondWith('DELETE', categoryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/productSettings');
                    expect($('.ui-dialog')).to.not.exist;

                });

                it('Try to open CreateView', function(){
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var categoryUrl = '/category';

                    server.respondWith('GET', categoryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCategories)]);
                    $createBtn.click();
                    listView.createItem();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to create new category', function () {
                    var $select;
                    var $dialogEl = $('.ui-dialog');
                    var $categoryName = $dialogEl.find('#categoryName');
                    var $categorySelect = $dialogEl.find('#parentCategory');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.create-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)')
                    var categoryUrl = new RegExp('\/category\/', 'i');

                    $categoryName.val('Test');
                    $categorySelect.click();
                    $select = $dialogEl.find('#56459202624e48551dfe3b24');
                    $select.click();

                    server.respondWith('POST', categoryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/productSettings');
                });

            });
        });
    });


});
*/
