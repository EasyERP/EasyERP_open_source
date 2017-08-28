define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/main/MainTemplate.html',
    'models/EmployeesModel',
    'models/UsersModel',
    'views/menu/LeftMenuView',
    'views/Employees/EditView',
    'views/Users/EditView',
    'collections/menu/MenuItems',
    'dataService',
    'constants',
    'constants/googleAnalytics',
    'helpers/ga',
    'views/guideTours/listView'
], function (Backbone, _, $, MainTemplate, EmployeesModel, UsersModel, LeftMenuView, EmployeeEditView, UserEditView, MenuItemsCollection, dataService, CONSTANTS, GA, ga,
             GuideToursListView) {
    'use strict';
    var MainView = Backbone.View.extend({
        el      : '#wrapper',
        template: _.template(MainTemplate),

        initialize: function (options) {
            this.contentType = options ? options.contentType : null;
            this.collection = new MenuItemsCollection();
            this.collection.bind('reset', this.render, this);

            this.bindMouseEvents();

            return this;
        },

        events: {
            'click .sidebarToggler': 'expandCollapse',
            'click #loginPanel'    : 'openLogin',
            'click #userpage'      : 'goToMyProfile',
            'click #logout'        : 'clickLogOut',
            'click .integrationBtn': 'clickIntegrationBtn',
            'click #clearDemoData' : 'clearDemoData',
            'click #guide'         : 'openGuide'
        },

        bindMouseEvents: function () {
            var $thisEl = this.$el;
            var _onSubMenuHover;
            var _onSubMenuLeave;

            /* _.bindAll(this, 'onSubMenuHover', 'onSubMenuLeave');
             _onSubMenuHover = _.debounce(this.onSubMenuHover, 300);
             _onSubMenuLeave = _.debounce(this.onSubMenuLeave, 900);

             $thisEl.on('mouseover', '#submenuHolder:not(.preventActions)', _onSubMenuHover);
             $thisEl.on('mouseleave', '#submenuHolder:not(.preventActions)', _onSubMenuLeave); */

        },

        expandCollapse: function () {
            var url = window.location.hash;
            var contentType = url.split('/') ? url.split('/')[1] : '';
            var resizableArray = ['reportsDashboard', 'purchaseDashboard'];
            var $thisEl = this.$el;
            var $subMenuHolder = $thisEl.find('#submenuHolder');

            $thisEl.toggleClass('collapsed');
            $subMenuHolder.toggleClass('preventActions');

            if (resizableArray.indexOf(contentType) > -1) {
                $(window).trigger('resize');
            }

            // this.leftMenu.applyScroll();
        },

        clickIntegrationBtn: function () {
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.MAIN_VIEW,
                eventLabel   : GA.EVENT_LABEL.INTEGRATIONS,
                eventValue   : GA.EVENTS_VALUES[5],
                fieldsObject : {}
            });
        },

        clickLogOut: function () {
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.MAIN_VIEW,
                eventLabel   : GA.EVENT_LABEL.LOG_OUT,
                eventValue   : GA.EVENTS_VALUES[4],
                fieldsObject : {}
            });
        },

        openLogin: function (e) {
            e.stopPropagation();
            $(e.target).closest('.loginPanel').toggleClass('open');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.MAIN_VIEW,
                eventLabel   : GA.EVENT_LABEL.PROFILE_ICON,
                eventValue   : GA.EVENTS_VALUES[2],
                fieldsObject : {}
            });
        },

        goToMyProfile: function (e) {
            var profileName = App.currentUser && App.currentUser.profile && App.currentUser.profile.profileName;
            var employee;
            var editView;

            e.preventDefault();

            if (App.currentUser && App.currentUser.relatedEmployee && App.currentUser.relatedEmployee._id) {
                employee = new EmployeesModel({_id: App.currentUser._id}); // get employee by relatedUser
                employee.fetch({
                    success: function (model) {
                        model.set('isForProfile', true);

                        return new EmployeeEditView({
                            profileName: profileName,
                            currentUser: true,
                            model      : model
                        });
                    },

                    error: function (model, xhr) {
                        App.render({
                            type   : 'error',
                            message: xhr.statusText
                        });
                    }
                });

            } else {
                editView = new UserEditView({
                    profileName: profileName,
                    currentUser: true,
                    model      : new UsersModel(App.currentUser)
                });
            }

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : GA.EVENT_ACTIONS.MAIN_VIEW,
                eventLabel   : GA.EVENT_LABEL.OPEN_PROFILE,
                eventValue   : GA.EVENTS_VALUES[3],
                fieldsObject : {}
            });
        },

        createMenuViews: function () {
            var modules = this.collection.toJSON();

            if (this.contentType) {
                this.currentModule = this.contentType;

                for (var i = modules.length; i--;) {
                    for (var j = modules[i].subModules.length; j--;) {
                        if (modules[i].subModules[j].href === this.contentType) {
                            this.currentRoot = modules[i].href;
                            break;
                        }
                    }
                    if (this.currentRoot) {
                        break;
                    }
                }
            } else {
                this.currentRoot = modules[0].href;
                this.currentModule = modules[0].subModules[0].href;

                Backbone.history.navigate('easyErp/' + this.currentModule, {trigger: true});
            }

            this.leftMenu = new LeftMenuView({
                collection   : this.collection,
                currentRoot  : this.currentRoot,
                currentModule: this.currentModule
            });
        },

        updateMenu: function (contentType) {
            var modules = this.collection.toJSON();
            var rootIndex;
            var childIndex;
            var i;
            var j;

            $(window).unbind('resize');

            for (i = modules.length; i--;) {
                for (j = modules[i].subModules.length; j--;) {
                    if (modules[i].subModules[j].href === contentType) {
                        rootIndex = i;
                        childIndex = j;
                        break;
                    }
                }

                if (rootIndex) {
                    break;
                }
            }

            this.leftMenu.selectMenuItem(rootIndex, childIndex);
        },

        onSubMenuHover: function (e) {
            var $thisEl = this.$el;

            $thisEl.removeClass('collapsed');
        },

        onSubMenuLeave: function (e) {
            var $thisEl = this.$el;

            $thisEl.addClass('collapsed');
        },

        clearDemoData: function () {
            var answer = confirm('Do you really want to delete ALL DATA except settings!?');

            if (answer) {
                dataService.getData('/clearDemoData', {}, function (result) {
                    if (!result.error) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                        return false;
                    }

                    return App.render({type: 'error', message: 'Some error'});
                });
            }
        },

        openGuide: function () {
            new GuideToursListView();
        },

        render: function () {
            var self = this;

            if (!App.organizationSettings) {
                dataService.getData('/organizationSettings', null, function (response) {
                    if (response && !response.error) {
                        App.organizationSettings = response.data;
                        if (response.data && response.data.startDate) { // toDo enable StartDate of program
                            $.datepicker.setDefaults({
                                firstDay: 1,
                                minDate : new Date(response.data.startDate)
                            });
                        }

                    }
                });
            }

            if (!App.currentUser || !App.currentUser.login) {

                dataService.getData(CONSTANTS.URLS.CURRENT_USER, null, function (response) {
                    var gatherInfoUrl = '#easyErp/gatherInfo';
                    var currentUser;

                    currentUser = response.user || {};

                    App.currentUser = currentUser;

                    if (!App.filtersObject) {
                        App.filtersObject = {};
                    }

                    App.filtersObject.savedFilters = response.savedFilters || {};

                    if (currentUser.profile && currentUser.profile.profileName === 'baned') {
                        $('title').text('EasyERP');
                    }

                    self.$el.html(self.template(currentUser));
                    self.createMenuViews();
                    self.trigger('rendered');

                    if (!App.currentUser.mobilePhone || App.currentUser.mobilePhone.length === 1) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(gatherInfoUrl, {trigger: true});
                    }
                });

            } else {
                if (App.currentUser && App.currentUser.profile && App.currentUser.profile.profileName === 'baned') {
                    $('title').text('EasyERP');
                }

                self.$el.html(self.template(App.currentUser));
                self.createMenuViews();
                self.trigger('rendered');
            }

            this.$el.on('click', function (e) {
                var $target = $(e.target);
                var $dateRangeContainer = $target.closest('.dateFilter');

                if (!$dateRangeContainer.length) {
                    self.$el.find('.dateFilter .frameDetail').addClass('hidden');
                }
            });

            return this;
        }
    });

    return MainView;
});
