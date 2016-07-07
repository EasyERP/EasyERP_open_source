define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/main/MainView',
    'views/login/LoginView',
    'dataService',
    'helpers/eventsBinder',
    'custom',
    'common',
    'constants'

], function (Backbone, _, $, mainView, loginView, dataService, eventsBinder, custom, common, CONSTANTS) {
    'use strict';
    var bindDefaultUIListeners = function () {
        $(document).on('keydown', '.ui-dialog', function (e) {
            if ($(e.target).get(0).tagName.toLowerCase() === 'textarea') {
                return;
            }
            switch (e.which) {
                case 27:
                    $('.edit-dialog').remove();
                    break;
                case 13:
                    $('.ui-dialog-buttonset .ui-button').eq(0).trigger('click');
                    break;
                default:
                    break;
            }
        });
        $(document).on('keypress', '.onlyNumber', function (e) {
            var charCode = (e.which) ? e.which : e.keyCode;

            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }

            return true;
        });

        $(window).on('resize', function (e) {
            $('#ui-datepicker-div').hide();
        });

        $(document).on('paste', '.onlyNumber', function (e) {
            return false;
        });

        $(document).on('click', function () {
            var currentContentType = self.contentType ? self.contentType.toUpperCase() : '';
            var contentTypes = {QUOTATIONS: 'Quotations', ORDERS: 'Orders', INVOICES: 'Invoices'};

            if (contentTypes[currentContentType]) {
                $('.list2 tbody').find('[data-id="false"]').remove();
            }
        });
    }
    var appRouter = Backbone.Router.extend({

        wrapperView: null,
        mainView   : null,
        topBarView : null,
        view       : null,

        routes: {
            home                                                                                            : 'any',
            'login(?password=:password&dbId=:dbId&email=:email)'                                            : 'login',
            'easyErp/:contentType/kanban(/:parrentContentId)(/filter=:filter)'                              : 'goToKanban',
            'easyErp/:contentType/thumbnails(/c=:countPerPage)(/filter=:filter)'                            : 'goToThumbnails',
            'easyErp/:contentType/form(/:modelId)'                                                          : 'goToForm', // FixMe chenge to required Id after test
            'easyErp/:contentType/list(/pId=:parrentContentId)(/p=:page)(/c=:countPerPage)(/filter=:filter)': 'goToList',
            'easyErp/Revenue(/filter=:filter)'                                                              : 'revenue',
            'easyErp/settingsEmployee(/filter=:filter)'                                                     : 'settingsEmployee',
            'easyErp/Efficiency'                                                                            : 'hours',
            'easyErp/Attendance'                                                                            : 'attendance',
            'easyErp/Profiles'                                                                              : 'goToProfiles',
            'easyErp/productSettings'                                                                       : 'productSettings',
            'easyErp/myProfile'                                                                             : 'goToUserPages',
            'easyErp/Workflows'                                                                             : 'goToWorkflows',
            'easyErp/Accounts'                                                                              : 'goToAccounts',
            'easyErp/Dashboard'                                                                             : 'goToDashboard',
            'easyErp/DashBoardVacation(/filter=:filter)'                                                    : 'dashBoardVacation',
            'easyErp/invoiceCharts(/filter=:filter)'                                                        : 'invoiceCharts',
            'easyErp/HrDashboard'                                                                           : 'hrDashboard',
            'easyErp/projectDashboard'                                                                      : 'goToProjectDashboard',
            // "easyErp/jobsDashboard(/filter=:filter)"                                                        : "goToJobsDashboard",
            'easyErp/:contentType'                                                                          : 'getList',
            '*any'                                                                                          : 'any'
        },

        initialize: function () {
            var self = this;

            this.on('all', function () {
                $('.ui-dialog').remove();
                $('#ui-datepicker-div').hide().remove();
            });

            bindDefaultUIListeners();

            if (!App || !App.currentUser) {
                dataService.getData(CONSTANTS.URLS.CURRENT_USER, null, function (response) {
                    if (response && !response.error) {
                        App.currentUser = response.user;
                        if (!App.filtersObject) {
                            App.filtersObject = {};
                        }
                        App.filtersObject.savedFilters = response.savedFilters;
                    }
                    /*else {
                     App.render({
                     type   : 'error',
                     message: 'can\'t fetch currentUser'
                     });
                     }*/
                });
            }
        },

        dashBoardVacation: function (filter) {
            var self = this;

            filter = filter || custom.retriveFromCash('DashVacation.filter');

            if (filter && typeof filter === 'string') {
                filter = decodeURIComponent(filter);
                filter = JSON.parse(filter);
            }

            if (!this.isAuth) {
                this.checkLogin(function (success) {
                    if (success) {
                        self.isAuth = true;
                        renderDash();
                    } else {
                        self.redirectTo();
                    }
                });
            } else {
                renderDash();
            }

            function renderDash() {
                var startTime = new Date();
                var contentViewUrl = "views/vacationDashboard/index";
                var topBarViewUrl = "views/vacationDashboard/TopBarView";

                if (self.mainView === null) {
                    self.main("DashBoardVacation");
                } else {
                    self.mainView.updateMenu("DashBoardVacation");
                }

                require([contentViewUrl, topBarViewUrl], function (contentView, TopBarView) {
                    var contentview;
                    var topbarView;

                    custom.setCurrentVT('list');

                    topbarView = new TopBarView();
                    contentview = new contentView({
                        startTime: startTime,
                        filter   : filter
                    });
                    topbarView.bind('changeDateRange', contentview.changeDateRange, contentview);

                    self.changeView(contentview);
                    self.changeTopBarView(topbarView);
                });
            }
        },

        invoiceCharts: function (filter) {
            var self = this;

            if (filter) {
                filter = decodeURIComponent(filter);
                filter = JSON.parse(filter);
            }

            if (!this.isAuth) {
                this.checkLogin(function (success) {
                    if (success) {
                        self.isAuth = true;
                        render();
                    } else {
                        self.redirectTo();
                    }
                });
            } else {
                render();
            }

            function render() {
                var startTime = new Date();
                var contentViewUrl = "views/invoiceCharts/index";
                var collectionUrl = 'collections/invoiceCharts/invoiceCharts';
                var topBarViewUrl = "views/invoiceCharts/TopBarView";

                if (self.mainView === null) {
                    self.main("invoiceCharts");
                } else {
                    self.mainView.updateMenu("invoiceCharts");
                }

                require([collectionUrl, contentViewUrl, topBarViewUrl], function (ChartCollection, contentView, TopBarView) {
                    var collection = new ChartCollection();
                    var contentview;
                    var topbarView;

                    custom.setCurrentVT('list');

                    collection.on('reset', renderChart);

                    function renderChart() {
                        topbarView = new TopBarView();
                        contentview = new contentView({
                            startTime : startTime,
                            filter    : filter,
                            collection: collection
                        });
                        topbarView.bind('changeDateRange', contentview.changeDateRange, contentview);

                        self.changeView(contentview);
                        self.changeTopBarView(topbarView);
                    }
                });
            }
        },

        hrDashboard: function () {
            var self = this;

            if (!this.isAuth) {
                this.checkLogin(function (success) {
                    if (success) {
                        self.isAuth = true;
                        renderDash();
                    } else {
                        self.redirectTo();
                    }
                });
            } else {
                renderDash();
            }

            function renderDash() {
                var startTime = new Date();
                var contentViewUrl = "views/hrDashboard/index";

                if (self.mainView === null) {
                    self.main("HrDashboard");
                } else {
                    self.mainView.updateMenu("HrDashboard");
                }

                require([contentViewUrl], function (contentView) {
                    var contentview;

                    custom.setCurrentVT('list');

                    contentview = new contentView({startTime: startTime});

                    self.changeView(contentview, true);
                });
            }
        },

        redirectTo: function () {
            if (App.requestedURL === null) {
                App.requestedURL = Backbone.history.fragment;
            }

            Backbone.history.fragment = '';
            Backbone.history.navigate('login', {trigger: true});
        },

        revenue: function (filter) {
            var self = this;

            if (filter) {
                filter = decodeURIComponent(filter);
                filter = JSON.parse(filter);
            }

            if (!this.isAuth) {
                this.checkLogin(function (success) {
                    if (success) {
                        self.isAuth = true;
                        renderRevenue();
                    } else {
                        self.redirectTo();
                    }
                });
            } else {
                renderRevenue();
            }

            function renderRevenue() {
                var startTime = new Date();
                var collectionUrl = 'collections/revenue/profit';
                var topBarViewUrl = 'views/Revenue/TopBarView';
                var contentViewUrl = 'views/Revenue/index';

                if (self.mainView === null) {
                    self.main('Revenue');
                } else {
                    self.mainView.updateMenu('Revenue');
                }

                require([collectionUrl, contentViewUrl, topBarViewUrl], function (ChartCollection, ContentView, TopBarView) {
                    var topbarView = new TopBarView({
                        startTime: startTime,
                        filter   : filter
                        // collection: collection
                    });
                    var contentview;

                    function render() {
                        contentview = new ContentView({
                            startTime: startTime,
                            filter   : filter
                            // collection: collection
                        });
                        topbarView.bind('changeDateRange', contentview.changeDateRange, contentview);

                        self.changeView(contentview);
                        self.changeTopBarView(topbarView);
                    }

                    topbarView.on('render', render);
                    topbarView.render();

                    custom.setCurrentVT('list');
                });
            }
        },

        settingsEmployee: function (filter) {
            var self = this;

            if (filter) {
                filter = decodeURIComponent(filter);
                filter = JSON.parse(filter);
            }

            if (!this.isAuth) {
                this.checkLogin(function (success) {
                    if (success) {
                        self.isAuth = true;
                        renderSettingsEmployee();
                    } else {
                        self.redirectTo();
                    }
                });
            } else {
                renderSettingsEmployee();
            }

            function renderSettingsEmployee() {
                var startTime = new Date();
                var topBarViewUrl = 'views/settingsEmployee/TopBarView';
                var contentViewUrl = 'views/settingsEmployee/index';

                if (self.mainView === null) {
                    self.main('settingsEmployee');
                } else {
                    self.mainView.updateMenu('settingsEmployee');
                }

                require([contentViewUrl, topBarViewUrl], function (ContentView, TopBarView) {
                    var topbarView = new TopBarView({
                        startTime: startTime,
                        filter   : filter
                        // collection: collection
                    });
                    var contentview;

                    topbarView.render();

                    contentview = new ContentView({
                        startTime: startTime,
                        filter   : filter
                        // collection: collection
                    });

                });
            }
        },

        hours: function () {
            var self = this;

            if (!this.isAuth) {
                this.checkLogin(function (success) {
                    if (success) {
                        self.isAuth = true;
                        renderRevenue();
                    } else {
                        self.redirectTo();
                    }
                });
            } else {
                renderRevenue();
            }

            function renderRevenue() {
                var startTime = new Date();
                var contentViewUrl = "views/Hours/index";

                if (self.mainView === null) {
                    self.main("Efficiency");
                } else {
                    self.mainView.updateMenu("Efficiency");
                }

                require([contentViewUrl], function (contentView) {
                    var contentview;

                    custom.setCurrentVT('list');

                    contentview = new contentView({startTime: startTime});

                    self.changeView(contentview, true);
                });
            }
        },

        attendance: function () {
            var self = this;

            this.checkLogin(function (success) {
                if (success) {
                    renderAttendance(self);
                } else {
                    self.redirectTo();
                }
            });

            function renderAttendance(context) {
                var contentViewUrl = "views/Attendance/index";
                var topBarViewUrl = 'views/Attendance/TopBarView';
                var self = context;

                if (context.mainView === null) {
                    context.main("Attendance");
                } else {
                    context.mainView.updateMenu("Attendance");
                }

                require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {
                    var contentview = new contentView();
                    var topBar = new topBarView({actionType: "Content"});
                    self.changeView(contentview);
                    self.changeTopBarView(topBar);
                });
            }
        },

        goToProfiles: function () {
            var self = this;

            this.checkLogin(function (success) {
                if (success) {
                    goProfile(self);
                } else {
                    self.redirectTo();
                }
            });

            function goProfile(context) {
                var startTime = new Date();
                if (context.mainView === null) {
                    context.main("Profiles");
                } else {
                    context.mainView.updateMenu("Profiles");
                }

                var contentViewUrl = 'views/Profiles/ContentView';
                var topBarViewUrl = 'views/Profiles/TopBarView';
                var collectionUrl = 'collections/Profiles/ProfilesCollection';

                var self = context;

                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                    var collection = new contentCollection();

                    collection.bind('reset', _.bind(createViews, self));
                    custom.setCurrentVT('list');

                    function createViews() {
                        collection.unbind('reset');
                        var contentview = new contentView({collection: collection, startTime: startTime});
                        var url = '#easyErp/Profiles';
                        var topbarView = new topBarView({actionType: "Content"});

                        topbarView.bind('createEvent', contentview.createItem, contentview);
                        topbarView.bind('editEvent', contentview.editProfileDetails, contentview);
                        topbarView.bind('deleteEvent', contentview.deleteItems, contentview);

                        topbarView.bind('saveEvent', contentview.saveProfile, contentview);
                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);
                        Backbone.history.navigate(url, {replace: true});
                    }
                });
            }
        },

        goToAccounts: function () {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goAccounts(self);
                } else {
                    self.redirectTo();
                }
            });

            function goAccounts(context) {
                var startTime = new Date();
                var contentViewUrl = "views/Accounting/ContentView";
                var topBarViewUrl = "views/Accounting/TopBarView";
                var self = context;

                if (context.mainView === null) {
                    context.main("Accounts");
                } else {
                    context.mainView.updateMenu("Accounts");
                }

                require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {

                    var contentview = new contentView({startTime: startTime});
                    var topbarView = new topBarView({actionType: "Content"});
                    self.changeView(contentview);
                    self.changeTopBarView(topbarView);
                });
            }
        },

        productSettings: function () {
            var self = this;

            this.checkLogin(function (success) {
                if (success) {
                    goSettings(self);
                } else {
                    self.redirectTo();
                }
            });

            function goSettings(context) {
                var startTime = new Date();
                var contentViewUrl = 'views/settingsProduct/ContentView';
                var topBarViewUrl = 'views/settingsProduct/TopBarView';
                var collectionUrl = 'collections/Product/ProductCategories';
                var self = context;

                if (context.mainView === null) {
                    context.main("productSettings");
                } else {
                    context.mainView.updateMenu("productSettings");
                }

                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                    var collection = new contentCollection();

                    collection.bind('reset', _.bind(createViews, self));
                    custom.setCurrentVT('list');

                    function createViews() {
                        collection.unbind('reset');

                        var url;
                        var contentview = new contentView({collection: collection, startTime: startTime});
                        var topbarView = new topBarView({actionType: 'Content'});

                        topbarView.bind('createEvent', contentview.createItem, contentview);
                        topbarView.bind('editEvent', contentview.editItem, contentview);
                        topbarView.bind('deleteEvent', contentview.deleteItems, contentview);
                        topbarView.bind('saveEvent', contentview.saveItem, contentview);

                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);

                        url = '#easyErp/productSettings';

                        Backbone.history.navigate(url, {replace: true});
                    }
                });
            }
        },

        goToUserPages: function () {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goMyProfile(self);
                } else {
                    self.redirectTo();
                }
            });

            function goMyProfile(context) {
                var startTime = new Date();
                var contentViewUrl = "views/myProfile/ContentView";
                var topBarViewUrl = "views/myProfile/TopBarView";
                var self = context;
                if (context.mainView === null) {
                    context.main("Persons");
                } else {
                    context.mainView.updateMenu("Persons");
                }

                require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {

                    custom.setCurrentVT('list');
                    var url = '#easyErp/myProfile';
                    var contentview = new contentView({startTime: startTime});
                    var topbarView = new topBarView({actionType: "Content"});

                    self.changeView(contentview);
                    self.changeTopBarView(topbarView);

                    Backbone.history.navigate(url, {replace: true});
                });
            }
        },

        goToDashboard: function () {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goDashboard(self);
                } else {
                    self.redirectTo();
                }
            });

            function goDashboard(context) {
                var startTime = new Date();
                var contentViewUrl = "views/Dashboard/ContentView";
                var topBarViewUrl = "views/Dashboard/TopBarView";
                var self = context;

                if (context.mainView === null) {
                    context.main("Dashboard");
                } else {
                    context.mainView.updateMenu("Dashboard");
                }

                require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {

                    custom.setCurrentVT('list');

                    var contentview = new contentView({startTime: startTime});
                    var topbarView = new topBarView({actionType: "Content"});
                    self.changeView(contentview);
                    self.changeTopBarView(topbarView);
                });
            }
        },

        goToProjectDashboard: function () {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goProjectDashboard(self);
                } else {
                    self.redirectTo();
                }
            });

            function goProjectDashboard(context) {
                var startTime = new Date();
                var contentViewUrl = "views/projectDashboard/ContentView";
                var topBarViewUrl = "views/projectDashboard/TopBarView";
                var self = context;

                if (context.mainView === null) {
                    context.main("projectDashboard");
                } else {
                    context.mainView.updateMenu("projectDashboard");
                }

                require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {

                    custom.setCurrentVT('list');

                    var contentview = new contentView({startTime: startTime});
                    var topbarView = new topBarView({actionType: "Content"});
                    self.changeView(contentview);
                    self.changeTopBarView(topbarView);
                });
            }
        },

        goToJobsDashboard: function (filter) {
            var self = this;
            if (filter) {
                filter = JSON.parse(filter);
            }

            this.checkLogin(function (success) {
                if (success) {
                    goProjectDashboard(self);
                } else {
                    self.redirectTo();
                }
            });

            function goProjectDashboard(context) {
                var startTime = new Date();
                var contentViewUrl = "views/jobsDashboard/ContentView";
                var topBarViewUrl = "views/jobsDashboard/TopBarView";
                var self = context;

                if (context.mainView === null) {
                    context.main("jobsDashboard");
                } else {
                    context.mainView.updateMenu("jobsDashboard");
                }

                require([contentViewUrl, topBarViewUrl], function (contentView, topBarView) {

                    custom.setCurrentVT('list');

                    var topbarView = new topBarView({
                        actionType: "Content"
                    });

                    var contentview = new contentView({
                        startTime: startTime,
                        filter   : filter
                    });

                    self.changeTopBarView(topbarView);

                    self.changeView(contentview);
                });
            }
        },

        goToWorkflows: function () {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goToWorkflows(self);
                } else {
                    self.redirectTo();
                }
            });

            function goToWorkflows(context) {
                var startTime = new Date();

                if (context.mainView === null) {
                    context.main("Workflows");
                } else {
                    context.mainView.updateMenu("Workflows");
                }

                var contentViewUrl = "views/Workflows/ContentView",
                    topBarViewUrl = "views/Workflows/TopBarView",
                    collectionUrl = "collections/Workflows/WorkflowsCollection";

                var self = context;

                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                    var collection = new contentCollection();

                    collection.bind('reset', _.bind(createViews, self));
                    custom.setCurrentVT('list');

                    function createViews() {
                        collection.unbind('reset');
                        var contentview = new contentView({collection: collection, startTime: startTime});
                        var topbarView = new topBarView({actionType: "Content"});
                        var url = '#easyErp/Workflows';

                        topbarView.bind('createEvent', contentview.createItem, contentview);
                        topbarView.bind('editEvent', contentview.editWorkflowsDetails, contentview);
                        topbarView.bind('deleteEvent', contentview.deleteItems, contentview);
                        topbarView.bind('saveEvent', contentview.saveProfile, contentview);

                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);

                        Backbone.history.navigate(url, {replace: true});
                    }
                });
            }
        },

        checkDatabase: function (db) {
            App.weTrack = true;

            App.weTrack = true; //todo remove
            App.currentDb = db;
        },

        buildCollectionRoute: function (contentType) {
            if (!contentType) {
                throw new Error('Error building collection route. ContentType is undefined');
            }
            switch (contentType) {
                case 'Birthdays':
                    return 'collections/' + contentType + '/filterCollection';
                default:
                    return 'collections/' + contentType + '/filterCollection';
            }
        },

        goToList: function (contentType, parrentContentId, page, countPerPage, filter) {
            var self = this;

            this.checkLogin(function (success) {
                if (success) {
                    if (!App || !App.currentDb) {
                        dataService.getData('/currentDb', null, function (response) {
                            if (response && !response.error) {
                                self.checkDatabase(response);
                            } else {
                                console.log('can\'t fetch current db');
                            }

                            goList(self);
                        });
                    } else {
                        goList(self);
                    }
                } else {
                    self.redirectTo();
                }
            });

            function goList(context) {
                var self = context;
                var currentContentType = context.testContent(contentType);
                var location = window.location.hash;
                var startTime = new Date();
                var url;
                var savedFilter;
                var startDate;
                var endDate;
                var contentViewUrl;
                var topBarViewUrl;
                var collectionUrl;
                var navigatePage;
                var count;

                if (contentType !== currentContentType) {
                    contentType = currentContentType;
                    url = '#easyErp/' + contentType + '/list';

                    if (parrentContentId) {
                        url += '/' + parrentContentId;
                    }

                    Backbone.history.navigate(url, {replace: true});
                }

                contentViewUrl = 'views/' + contentType + '/list/ListView';
                topBarViewUrl = 'views/' + contentType + '/TopBarView';
                collectionUrl = context.buildCollectionRoute(contentType);
                page = parseInt(page, 10);
                count = parseInt(countPerPage, 10);

                if (isNaN(page)) {
                    page = 1;
                }
                if (isNaN(count)) {
                    count = CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE;
                }

                if (!filter) {

                    filter = custom.getSavedFilterForCT(contentType) || custom.getDefSavedFilterForCT(contentType);

                    if (filter) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(location + '/c=' + countPerPage + '/filter=' + encodeURI(JSON.stringify(filter)), {replace: true});
                    }

                    if (contentType === 'salesProduct') {
                        filter = {
                            'canBeSold': {
                                key  : 'canBeSold',
                                value: ['true']
                            }

                        };

                        Backbone.history.fragment = '';
                        Backbone.history.navigate(location + '/filter=' + encodeURI(JSON.stringify(filter)), {replace: true});
                    } else if (contentType === 'Product') {
                        filter = {
                            canBePurchased: {
                                key  : 'canBePurchased',
                                value: ['true']
                            }
                        };
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(location + '/filter=' + encodeURI(JSON.stringify(filter)), {replace: true});
                    }
                } else if (filter) {
                    filter = JSON.parse(filter);
                }

                //savedFilter = custom.savedFilters(contentType, filter);
                //savedFilter = filter;

                if (context.mainView === null) {
                    context.main(contentType);
                } else {
                    context.mainView.updateMenu(contentType);
                }
                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                    var collection;

                    App.filtersObject.filter = filter;

                    collection = new contentCollection({
                        viewType        : 'list',
                        page            : page,
                        reset           : true,
                        count           : count,
                        filter          : filter,
                        parrentContentId: parrentContentId,
                        contentType     : contentType,
                        showMore        : false
                    });

                    collection.bind('reset', _.bind(createViews, self));
                    custom.setCurrentVT('list');

                    function createViews() {
                        var topbarView;
                        var contentview;

                        collection.unbind('reset');

                        topbarView = new topBarView({
                            actionType: 'Content',
                            collection: collection
                        });
                        contentview = new contentView({
                            collection: collection,
                            startTime : startTime,
                            filter    : filter
                        });

                        eventsBinder.subscribeTopBarEvents(topbarView, contentview);
                        eventsBinder.subscribeCollectionEvents(collection, contentview);

                        collection.trigger('fetchFinished', {
                            totalRecords: collection.totalRecords,
                            currentPage : collection.currentPage,
                            pageSize    : collection.pageSize
                        });

                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);
                    }
                });
            }
        },

        goToForm: function (contentType, modelId) {
            var self = this;

            this.checkLogin(function (success) {
                if (success) {
                    if (!App || !App.currentDb) {
                        dataService.getData('/currentDb', null, function (response) {
                            if (response && !response.error) {
                                self.checkDatabase(response);
                            } else {
                                console.log('can\'t fetch current db');
                            }

                            goForm(self);
                        });
                    } else {
                        goForm(self);
                    }
                } else {
                    self.redirectTo();
                }
            });

            function goForm(context) {
                var currentContentType = context.testContent(contentType);
                var self = context;
                var startTime = new Date();
                var contentFormModelUrl;
                var contentFormViewUrl;
                var topBarViewUrl;
                var url;

                if (contentType !== currentContentType) {
                    contentType = currentContentType;
                    url = '#easyErp/' + contentType + '/form';

                    if (modelId) {
                        url += '/' + modelId;
                    }

                    Backbone.history.navigate(url, {replace: true});
                }

                if (context.mainView === null) {
                    context.main(contentType);
                } else {
                    context.mainView.updateMenu(contentType);
                }

                if (contentType === 'PayrollExpenses') {
                    contentFormModelUrl = "collections/PayrollExpenses/monthCollection";
                    contentFormViewUrl = "views/" + contentType + "/form/FormView";
                    topBarViewUrl = "views/" + contentType + "/TopBarView";
                } else if (contentType !== 'ownCompanies') {
                    contentFormModelUrl = "models/" + contentType + "Model";
                    contentFormViewUrl = "views/" + contentType + "/form/FormView";
                    topBarViewUrl = "views/" + contentType + "/TopBarView";
                } else {
                    contentFormModelUrl = "models/CompaniesModel";
                    contentFormViewUrl = "views/" + contentType + "/form/FormView";
                    topBarViewUrl = "views/" + contentType + "/TopBarView";
                }

                custom.setCurrentVT('form');

                require([contentFormModelUrl, contentFormViewUrl, topBarViewUrl], function (contentFormModel, contentFormView, topBarView) {
                    var getModel = new contentFormModel();

                    if (contentType === 'PayrollExpenses') {
                        getModel.url = function () {
                            return '/payroll/' + modelId;
                        };
                    }

                    // getModel.urlRoot = '/' + contentType + '/form';
                    getModel.urlRoot = getModel.url() + modelId;
                    getModel.fetch({
                        // data: {id: modelId},
                        success: function (model) {
                            var topbarView = new topBarView({actionType: "Content"});
                            var contentView = new contentFormView({model: model, startTime: startTime});

                            topbarView.bind('pay', contentView.newPayment, contentView);
                            topbarView.bind('deleteEvent', contentView.deleteItems, contentView);
                            topbarView.bind('editEvent', contentView.editItem, contentView);
                            topbarView.bind('saveEvent', contentView.saveItem, contentView);
                            topbarView.bind('copyEvent', contentView.copy, contentView);
                            topbarView.bind('generateEvent', contentView.generate, contentView);
                            topbarView.bind('createEvent', contentView.createItem, contentView);
                            topbarView.bind('recountEvent', contentView.recount, contentView);

                            contentView.render();
                            self.changeView(contentView);
                            self.changeTopBarView(topbarView);
                        },
                        error  : function (model, response) {
                            if (response.status === 401) {
                                Backbone.history.navigate('#login', {trigger: true});
                            }
                        }
                    });
                });
            }
        },

        goToKanban: function (contentType, parrentContentId) {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goKanban(self);
                } else {
                    self.redirectTo();
                }
            });

            function goKanban(context) {
                var self = context;
                var currentContentType = context.testContent(contentType);
                if (contentType !== currentContentType) {
                    contentType = currentContentType;
                }
                var contentViewUrl = "views/" + contentType + "/kanban/KanbanView";
                var topBarViewUrl = "views/" + contentType + "/TopBarView";
                var collectionUrl = "collections/Workflows/WorkflowsCollection";

                if (context.mainView === null) {
                    context.main(contentType);
                } else {
                    context.mainView.updateMenu(contentType);
                }
                custom.setCurrentVT('kanban');
                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, workflowsCollection) {
                    var startTime = new Date();

                    var collection = new workflowsCollection({id: contentType});
                    var url = 'easyErp/' + contentType + '/kanban';

                    collection.bind('reset', _.bind(createViews, self));

                    function createViews() {
                        var contentview = new contentView({
                            workflowCollection: collection,
                            startTime         : startTime,
                            parrentContentId  : parrentContentId
                        });
                        var topbarView = new topBarView({actionType: "Content"});

                        collection.unbind('reset');

                        topbarView.bind('createEvent', contentview.createItem, contentview);
                        topbarView.bind('editEvent', contentview.editItem, contentview);
                        topbarView.bind('editKanban', contentview.editKanban, contentview);

                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);

                        if (parrentContentId) {
                            url += '/' + parrentContentId;
                        }

                        url = encodeURI(url);

                        Backbone.history.navigate(url, {replace: true});
                    }
                });
            }
        },

        goToThumbnails: function (contentType, countPerPage, filter) {
            var self = this;

            this.checkLogin(function (success) {
                if (success) {
                    if (!App || !App.currentDb) {
                        dataService.getData('/currentDb', null, function (response) {
                            if (response && !response.error) {
                                self.checkDatabase(response);
                            } else {
                                console.log('can\'t fetch current db');
                            }

                            goThumbnails(self);
                        });
                    } else {
                        goThumbnails(self);
                    }
                } else {
                    self.redirectTo();
                }
            });

            function goThumbnails(context) {
                var self = context;
                var location = window.location.hash;
                var currentContentType = context.testContent(contentType);
                var newCollection = true;
                var startTime = new Date();
                var viewType = custom.getCurrentVT({contentType: contentType}); // for default filter && defaultViewType
                var topBarViewUrl;
                var contentViewUrl;
                var collectionUrl;
                var savedFilter;
                var url;

                if (countPerPage) {
                    countPerPage = parseInt(countPerPage, 10);

                    if (isNaN(countPerPage)) {
                        countPerPage = 0;
                    }
                }

                if (contentType !== currentContentType) {
                    contentType = currentContentType;
                    url = '#easyErp/' + contentType + '/' + viewType;

                    Backbone.history.navigate(url, {replace: true});
                }

                topBarViewUrl = 'views/' + contentType + '/TopBarView';

                if (!filter) {

                    filter = custom.getSavedFilterForCT(contentType) || custom.getDefSavedFilterForCT(contentType);

                    if (filter) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(location + '/c=' + countPerPage + '/filter=' + encodeURI(JSON.stringify(filter)), {replace: true});
                    }

                    if (contentType === 'salesProduct') {
                        filter = {
                            canBeSold: {
                                key  : 'canBeSold',
                                value: ['true']
                            }
                        };
                    } else if (contentType === 'Product') {
                        filter = {
                            canBePurchased: {
                                key  : 'canBePurchased',
                                value: ['true']
                            }
                        };
                    }
                } else {
                    filter = JSON.parse(filter);
                }

                // savedFilter = custom.savedFilters(contentType, filter);

                if (context.mainView === null) {
                    context.main(contentType);
                } else {
                    context.mainView.updateMenu(contentType);
                }

                contentViewUrl = 'views/' + contentType + '/thumbnails/ThumbnailsView';
                collectionUrl = context.buildCollectionRoute(contentType);

                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                    var collection;

                    App.filtersObject.filter = filter;

                    if (contentType !== 'Workflows') {
                        collection = new contentCollection({
                            viewType   : 'thumbnails',
                            reset      : true,
                            showMore   : false,
                            count      : countPerPage,
                            filter     : filter,
                            contentType: contentType
                        });
                    } else {
                        collection = new contentCollection();
                    }

                    collection.bind('reset', _.bind(createViews, self));
                    custom.setCurrentVT('thumbnails');

                    function createViews() {
                        var contentview = new contentView({
                            collection: collection,
                            startTime : startTime,
                            filter    : filter
                        });
                        var topbarView = new topBarView({actionType: 'Content', collection: collection});

                        collection.unbind('reset');
                        // var url = '#easyErp/' + contentType + '/thumbnails';
                        eventsBinder.subscribeCollectionEvents(collection, contentview);
                        eventsBinder.subscribeTopBarEvents(topbarView, contentview);

                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);
                        // just for add showMore button if needed
                        collection.trigger('fetchFinished', {
                            totalRecords: collection.totalRecords,
                            currentPage : collection.currentPage,
                            pageSize    : collection.pageSize
                        });
                        // Backbone.history.navigate(url, { replace: true });
                    }
                });
            }
        },

        testContent: function (contentType) {
            if (!CONSTANTS[contentType.toUpperCase()]) {
                contentType = CONSTANTS.PERSONS;
            }

            return contentType;
        },

        getList: function (contentType) {
            var viewType;

            this.contentType = contentType;

            contentType = this.testContent(contentType);
            viewType = custom.getCurrentVT({contentType: contentType});

            Backbone.history.navigate('#easyErp/' + contentType + '/' + viewType, {trigger: true, replace: true});
        },

        changeWrapperView: function (wrapperView) {
            if (this.wrapperView) {
                this.wrapperView.undelegateEvents();
            }
            this.wrapperView = wrapperView;
        },

        changeTopBarView: function (topBarView) {
            if (this.topBarView) {
                this.topBarView.undelegateEvents();
            }
            this.topBarView = topBarView;
        },

        changeView: function (view, hideTopBar) {
            if (hideTopBar) {
                $('#top-bar').hide();
            } else {
                $('#top-bar').show();
            }

            if (this.view) {
                this.view.undelegateEvents();
            }

            $(document).trigger('resize');

            this.view = view;
        },

        main: function (contentType) {
            this.mainView = new mainView({contentType: contentType});
            this.changeWrapperView(this.mainView);
        },

        any: function () {
            this.mainView = new mainView();
            this.changeWrapperView(this.mainView);
        },

        login: function (password, dbId, email) {
            var url = '/getDBS';
            var self = this;

            dbId = dbId || '';
            email = email || '';
            password = password || '';

            this.mainView = null;

            $.ajax({
                url    : url,
                type   : 'GET',
                success: function (response) {
                    self.changeWrapperView(new loginView({
                        dbs      : response.dbsNames,
                        currentDb: dbId,
                        password : password,
                        login    : email
                    }));
                },
                error  : function () {
                    self.changeWrapperView(new loginView());
                }
            });
        }
    });

    return appRouter;
});
