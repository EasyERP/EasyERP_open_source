define([
    'modules',
    'text!fixtures/index.html',
    'collections/Products/ProductCategories',
    'views/main/MainView',
    'views/settingsProduct/ContentView',
    'views/settingsProduct/TopBarView',
    'views/settingsProduct/CreateView',
    'views/settingsProduct/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, CategoriesCollection, MainView, ContentView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    var fakeCategories = {
        data: [
            {
                _id         : "564591f9624e48551dfe3b23",
                __v         : 0,
                sequence    : 0,
                nestingLevel: null,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:32:09.792Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : null,
                fullName    : "All",
                name        : "All"
            },
            {
                _id         : "56459202624e48551dfe3b24",
                __v         : 0,
                sequence    : 0,
                nestingLevel: null,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:32:18.495Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "564591f9624e48551dfe3b23",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:09.792Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : null,
                    fullName    : "All",
                    name        : "All"
                },
                fullName    : "All / Expenses",
                name        : "Expenses"
            },
            {
                _id         : "5645925f624e48551dfe3b26",
                __v         : 0,
                sequence    : 1,
                nestingLevel: null,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:33:51.900Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "56459202624e48551dfe3b24",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : "564591f9624e48551dfe3b23",
                    fullName    : "All / Expenses",
                    name        : "Expenses"
                },
                fullName    : "All / Expenses / Bonus Card",
                name        : "Bonus Card"
            },
            {
                _id         : "5645920f624e48551dfe3b25",
                __v         : 0,
                sequence    : 6,
                nestingLevel: null,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:32:31.085Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "56459202624e48551dfe3b24",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : "564591f9624e48551dfe3b23",
                    fullName    : "All / Expenses",
                    name        : "Expenses"
                },
                fullName    : "All / Expenses / Bonus Cash",
                name        : "Bonus Cash"
            },
            {
                _id         : "56459308abb1c35728ad7d10",
                __v         : 0,
                sequence    : 5,
                nestingLevel: 2,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:36:40.347Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "56459202624e48551dfe3b24",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : "564591f9624e48551dfe3b23",
                    fullName    : "All / Expenses",
                    name        : "Expenses"
                },
                fullName    : "All / Expenses / Salary Card",
                name        : "Salary Card"
            },
            {
                _id         : "564592fbabb1c35728ad7d0f",
                __v         : 0,
                sequence    : 0,
                nestingLevel: 1,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:36:27.099Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "56459202624e48551dfe3b24",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : "564591f9624e48551dfe3b23",
                    fullName    : "All / Expenses",
                    name        : "Expenses"
                },
                fullName    : "All / Expenses / Salary Cash",
                name        : "Salary Cash"
            }
        ]
    };
    var fakeCategoryById = {
        _id         : "564591f9624e48551dfe3b23",
        __v         : 0,
        sequence    : 0,
        nestingLevel: null,
        editedBy    : {
            user: "52203e707d4dba8813000003"
        },
        createdBy   : {
            date: "2015-11-13T07:32:09.792Z",
            user: "52203e707d4dba8813000003"
        },
        users       : [],
        parent      : null,
        fullName    : "All",
        name        : "All"
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

                server.respondWith('GET', '/modules/', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);

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
                    count      : 0,
                    page       : 1,
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
                        startTime : new Date()
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

                it('Try to open EditForm', function () {
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

                it('Try to edit item', function () {
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

                it('Try to delete current category', function () {
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)')
                    var categoryUrl = new RegExp('\/category\/', 'i');

                    server.respondWith('DELETE', categoryUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/productSettings');
                    expect($('.ui-dialog')).to.not.exist;

                });

                it('Try to open CreateView', function () {
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

                    $('.ui-dialog').remove();

                    expect(window.location.hash).to.be.equals('#easyErp/productSettings');
                });

            });
        });
    });


});
