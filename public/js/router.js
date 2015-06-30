define([
    'views/main/MainView',
    'views/login/LoginView',
    'custom',
    'common',
    'constants'

], function (mainView, loginView, custom, common, CONTENT_TYPES) {

    var appRouter = Backbone.Router.extend({

        wrapperView: null,
        mainView: null,
        topBarView: null,
        view: null,

        routes: {
            "home": "any",
            "login": "login",
            "easyErp/:contentType/kanban(/:parrentContentId)": "goToKanban",
            "easyErp/:contentType/thumbnails(/c=:countPerPage)(/filter=:filter)": "goToThumbnails",
            "easyErp/:contentType/form(/:modelId)": "goToForm", //FixMe chenge to required Id after test
            "easyErp/:contentType/list(/pId=:parrentContentId)(/p=:page)(/c=:countPerPage)(/filter=:filter)": "goToList",
            "easyErp/Revenue": "revenue",
            "easyErp/Profiles": "goToProfiles",
            "easyErp/myProfile": "goToUserPages",
            "easyErp/Workflows": "goToWorkflows",
            "easyErp/Dashboard": "goToDashboard",
            "easyErp/projectDashboard": "goToProjectDashboard",
            "easyErp/:contentType": "getList",

            "*any": "any"
        },



        initialize: function () {
            this.on('all', function () {
                $(".ui-dialog").remove();
                $("#ui-datepicker-div").hide().remove();
            });
            $(document).on("keydown", ".ui-dialog", function (e) {
                if ($(e.target).get(0).tagName.toLowerCase() == "textarea") {
                    return;
                }
                switch (e.which) {
                    case 27:
                        $(".edit-dialog").remove();
                        break;
                    case 13:
                        $(".ui-dialog-buttonset .ui-button").eq(0).trigger("click");
                        break;
                    default:
                        break;
                }
            });
            $(document).on("keypress", ".onlyNumber", function (e) {
                var charCode = (e.which) ? e.which : e.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                    return false;
                return true;
            });
            $(window).on("resize", function (e) {
                $("#ui-datepicker-div").hide();
                //				$(".hasDatepicker").datepicker("destroy");
            });
            $(document).on("paste", ".onlyNumber", function (e) {
                return false;
            });

            var self = this;

            $(document).on("click", function () {
                var currentContentType = self.contentType ? self.contentType.toUpperCase() : '';
                var contentTypes = {QUOTATION:'Quotation', ORDER:'Order', INVOICE:'Invoice'};
                if (contentTypes[currentContentType]) {
                    $(".list2 tbody").find("[data-id='false']").remove();
                }
            });
        },

        redirectTo: function(){
            if (App.requestedURL === null) {
                App.requestedURL = Backbone.history.fragment;
            }
            Backbone.history.fragment = "";
            Backbone.history.navigate("login", {trigger: true});
        },

        revenue: function(){
            var self = this;

            if(!this.isAuth) {
                this.checkLogin(function (success) {
                    if (success) {
                        self.isAuth = true;
                        renderRevenue();
                    } else {

                    }
                });
            }

            function renderRevenue () {
                var startTime = new Date();
                var contentViewUrl = "views/Revenue/index";

                if (self.mainView === null) {
                    self.main("Revenue");
                } else {
                    self.mainView.updateMenu("Revenue");
                }

                require([contentViewUrl], function (contentView) {
                    var contentview;

                    custom.setCurrentVT('list');

                    contentview = new contentView({startTime: startTime});

                    self.changeView(contentview);
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

            function goProfile (context) {
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

                    function createViews () {
                        collection.unbind('reset');
                        var contentview = new contentView({collection: collection, startTime: startTime});
                        var topbarView = new topBarView({actionType: "Content"});

                        topbarView.bind('createEvent', contentview.createItem, contentview);
                        topbarView.bind('editEvent', contentview.editProfileDetails, contentview);
                        topbarView.bind('deleteEvent', contentview.deleteItems, contentview);
                        topbarView.bind('saveEvent', contentview.saveProfile, contentview);

                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);
                        var url = '#easyErp/Profiles';
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

            function goMyProfile (context) {
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

                    var contentview = new contentView({startTime: startTime});
                    var topbarView = new topBarView({actionType: "Content"});

                    self.changeView(contentview);
                    self.changeTopBarView(topbarView);
                    var url = '#easyErp/myProfile';
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

            function goDashboard (context) {
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

            function goProjectDashboard (context) {
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

        goToWorkflows: function () {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goToWorkflows(self);
                } else {
                    self.redirectTo();
                }
            });

            function goToWorkflows (context) {
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

                    function createViews () {
                        collection.unbind('reset');
                        var contentview = new contentView({collection: collection, startTime: startTime});
                        var topbarView = new topBarView({actionType: "Content"});

                        topbarView.bind('createEvent', contentview.createItem, contentview);
                        topbarView.bind('editEvent', contentview.editWorkflowsDetails, contentview);
                        topbarView.bind('deleteEvent', contentview.deleteItems, contentview);
                        topbarView.bind('saveEvent', contentview.saveProfile, contentview);

                        context.changeView(contentview);
                        context.changeTopBarView(topbarView);
                        var url = '#easyErp/Workflows';
                        Backbone.history.navigate(url, {replace: true});
                    }
                });
            }
        },

        buildCollectionRoute: function (contentType) {
            if (!contentType) {
                throw new Error("Error building collection route. ContentType is undefined");
            }
            switch (contentType) {
                case 'Birthdays':
                    return "collections/" + contentType + "/filterCollection";
                default:
                    return "collections/" + contentType + "/filterCollection";
            }
        },

        goToList: function (contentType, parrentContentId, page, countPerPage, filter) {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goList(self);
                } else {
                    self.redirectTo();
                }
            });

            function goList (context) {
                var currentContentType = context.testContent(contentType);
                if (contentType !== currentContentType) {
                    contentType = currentContentType;
                    var url = '#easyErp/' + contentType + '/list';
                    if (parrentContentId)
                        url += '/' + parrentContentId;
                    Backbone.history.navigate(url, {replace: true});
                }
                var newCollection = true;
                var self = context;
                var startTime = new Date();
                var contentViewUrl = "views/" + contentType + "/list/ListView";
                var topBarViewUrl = "views/" + contentType + "/TopBarView";
                var collectionUrl = context.buildCollectionRoute(contentType);
                var navigatePage = (page) ? parseInt(page) : 1;
                var count = (countPerPage) ? parseInt(countPerPage) || 50 : 50;

                if (filter === 'empty') {
                    newCollection = false;
                } else if (filter) {
                    filter = JSON.parse(filter);
                }
                if (context.mainView === null) {
                    context.main(contentType);
                } else {
                    context.mainView.updateMenu(contentType);
                }
                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {
                    var collection = new contentCollection({
                        viewType: 'list',
                        page: navigatePage,
                        count: count,
                        filter: filter,
                        parrentContentId: parrentContentId,
                        contentType: contentType,
                        newCollection: newCollection
                    });

                    collection.bind('reset', _.bind(createViews, self));
                    custom.setCurrentVT('list');

                    function createViews () {
                        collection.unbind('reset');
                        var topbarView = new topBarView({actionType: "Content", collection: collection});
                        var contentview = new contentView({
                            collection: collection,
                            startTime: startTime,
                            filter: filter,
                            newCollection: newCollection
                        });

                        topbarView.bind('createEvent', contentview.createItem, contentview);
                        topbarView.bind('editEvent', contentview.editItem, contentview);
                        topbarView.bind('saveEvent', contentview.saveItem, contentview);
                        topbarView.bind('deleteEvent', contentview.deleteItems, contentview);
                        topbarView.bind('generateInvoice', contentview.generateInvoice, contentview);

                        collection.bind('showmore', contentview.showMoreContent, contentview);
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
                    goForm(self);
                } else {
                    self.redirectTo();
                }
            });

            function goForm (context) {
                var currentContentType = context.testContent(contentType);
                if (contentType !== currentContentType) {
                    contentType = currentContentType;
                    var url = '#easyErp/' + contentType + '/form';
                    if (modelId)
                        url += '/' + modelId;
                    Backbone.history.navigate(url, {replace: true});
                }
                var self = context;
                var startTime = new Date();
                var contentFormModelUrl;
                var contentFormViewUrl;
                var topBarViewUrl;
                if (context.mainView === null) {
                    context.main(contentType);
                } else {
                    context.mainView.updateMenu(contentType);
                }

                if (contentType !== 'ownCompanies') {
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

                    getModel.urlRoot = '/' + contentType + '/form';
                    getModel.fetch({
                        data: {id: modelId},
                        success: function (model) {
                            var topbarView = new topBarView({actionType: "Content"});
                            var contentView = new contentFormView({model: model, startTime: startTime});

                            topbarView.bind('deleteEvent', contentView.deleteItems, contentView);
                            topbarView.bind('editEvent', contentView.editItem, contentView);

                            contentView.render();
                            self.changeView(contentView);
                            self.changeTopBarView(topbarView);
                        },
                        error: function (model, response) {
                            if (response.status === 401) Backbone.history.navigate('#login', {trigger: true});
                        }
                    });
                });
            }
        },

        convertModelDates: function (model) {
            if (model.has('createdBy'))
                model.get('createdBy').date = common.utcDateToLocaleDateTime(model.get('createdBy').date);
            if (model.has('editedBy'))
                model.get('editedBy').date = common.utcDateToLocaleDateTime(model.get('editedBy').date);
            if (model.has('dateBirth'))
                model.set({
                    dateBirth: common.utcDateToLocaleDate(model.get('dateBirth'))
                });
            if (model.has('nextAction'))
                model.set({
                    nextAction: common.utcDateToLocaleDate(model.get('nextAction').date)
                });
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

            function goKanban (context) {
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

                    function createViews () {
                        var contentview = new contentView({
                            workflowCollection: collection,
                            startTime: startTime,
                            parrentContentId: parrentContentId
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

                        Backbone.history.navigate(url, {replace: true});
                    }
                });
            }
        },

        goToThumbnails: function (contentType, countPerPage, filter) {
            var self = this;
            this.checkLogin(function (success) {
                if (success) {
                    goThumbnails(self);
                } else {
                    self.redirectTo();
                }
            });

            function goThumbnails (context) {
                var currentContentType = context.testContent(contentType);
                if (contentType !== currentContentType) {
                    contentType = currentContentType;
                    var url = '#easyErp/' + contentType + '/thumbnails';
                    Backbone.history.navigate(url, {replace: true});
                }
                var newCollection = true;
                var startTime = new Date();
                var self = context;
                var contentViewUrl;
                var topBarViewUrl = "views/" + contentType + "/TopBarView";
                var collectionUrl;
                var count = (countPerPage) ? parseInt(countPerPage) || 50 : 50;
                if (filter === 'empty') {
                    newCollection = false;
                } else if (filter) {
                    filter = JSON.parse(filter);
                }
                if (context.mainView === null) {
                    context.main(contentType);
                } else {
                    context.mainView.updateMenu(contentType);
                }
                contentViewUrl = "views/" + contentType + "/thumbnails/ThumbnailsView";
                collectionUrl = context.buildCollectionRoute(contentType);
                require([contentViewUrl, topBarViewUrl, collectionUrl], function (contentView, topBarView, contentCollection) {

                    var collection = (contentType !== 'Calendar') && (contentType !== 'Workflows')
                        ? new contentCollection({
                        viewType: 'thumbnails',
                        //page: 1,
                        count: count,
                        filter: filter,
                        contentType: contentType,
                        newCollection: newCollection
                    })
                        : new contentCollection();

                    collection.bind('reset', _.bind(createViews, self));
                    custom.setCurrentVT('thumbnails');

                    function createViews () {
                        collection.unbind('reset');
                        var contentview = new contentView({
                            collection: collection,
                            startTime: startTime,
                            filter: filter,
                            newCollection: newCollection
                        });
                        var topbarView = new topBarView({actionType: "Content", collection: collection});
                        //var url = '#easyErp/' + contentType + '/thumbnails';
                        topbarView.bind('createEvent', contentview.createItem, contentview);
                        topbarView.bind('editEvent', contentview.editItem, contentview);
                        topbarView.bind('deleteEvent', contentview.deleteItems, contentview);

                        collection.bind('showmore', contentview.showMoreContent, contentview);
                        collection.bind('showmoreAlphabet', contentview.showMoreAlphabet, contentview);

                        context.changeView(contentview);
                        this.changeTopBarView(topbarView);

                        //Backbone.history.navigate(url, { replace: true });
                    }
                });
            }
        },

        testContent: function (contentType) {
            if (!CONTENT_TYPES[contentType.toUpperCase()])
                contentType = CONTENT_TYPES.PERSONS;
            return contentType;
        },

        getList: function (contentType) {

            this.contentType = contentType;
            contentType = this.testContent(contentType);
            var viewType = custom.getCurrentVT({contentType: contentType});
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

        changeView: function (view) {
            if (this.view) {
                this.view.undelegateEvents();
            }
            $(document).trigger("resize");
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

        login: function () {
            var url = "/getDBS";
            var self = this;

            this.mainView = null;

            $.ajax({
                url: url,
                type: "GET",
                success: function (response) {
                    self.changeWrapperView(new loginView({dbs: response.dbsNames}));
                },
                error: function () {
                    self.changeWrapperView(new loginView());
                }
            });
        }
    });

    return appRouter;
});