define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/main/MainTemplate.html',
    'views/menu/LeftMenuView',
    'collections/menu/MenuItems',
    'dataService',
    'constants'
], function (Backbone, _, $, MainTemplate, LeftMenuView, MenuItemsCollection, dataService, CONSTANTS) {
    'use strict';
    var MainView = Backbone.View.extend({
        el: '#wrapper',

        initialize: function (options) {
            this.contentType = options ? options.contentType : null;
            this.render();
            this.collection = new MenuItemsCollection();
            this.collection.bind('reset', this.createMenuViews, this);
        },

        events: {
            'click .sidebarToggler': 'expandCollapse',
            'click .loginPanel'    : 'openLogin'
        },

        expandCollapse: function () {
            $('body').toggleClass('collapsed');
        },

        openLogin: function (e) {
            $(e.target).closest('.loginPanel').toggleClass('open');
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

            for (var i = modules.length; i--;) {
                for (var j = modules[i].subModules.length; j--;) {
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

        render: function () {
            var icon;
            var log;

            if (!App || !App.currentUser || !App.currentUser.login) {

                dataService.getData(CONSTANTS.URLS.CURRENT_USER, null, function (response, context) {
                    var currentUser;

                    currentUser = response.user || {};

                    App.currentUser = currentUser;

                    if (!App.filtersObject) {
                        App.filtersObject = {};
                    }

                    App.filtersObject.savedFilters = response.savedFilters || {};

                    if (currentUser.profile && currentUser.profile.profileName === 'baned') {
                        $('title').text('EasyERP');
                        context.$el.find('li#userpage').remove();
                        context.$el.find('#top-bar').addClass('banned');
                        context.$el.find('#content-holder').append("<div id = 'banned'><div class='icon-banned'></div><div class='text-banned'><h1>Sorry, this user is banned!</h1><p>Please contact the administrator.</p></div></div>");
                    }
                    if (currentUser && currentUser.relatedEmployee) {
                        $('#loginPanel .iconEmployee').attr('src', currentUser.relatedEmployee.imageSrc);

                        if (currentUser.relatedEmployee.name) {
                            $('#loginPanel  #userName').text(currentUser.relatedEmployee.name.first + ' ' + currentUser.relatedEmployee.name.last);
                        } else {
                            $('#loginPanel  #userName').text(currentUser.login);
                        }
                    } else {
                        $('#loginPanel .iconEmployee').attr('src', currentUser.imageSrc);
                        $('#loginPanel  #userName').text(currentUser.login);
                    }
                }, this);

                this.$el.html(_.template(MainTemplate));
            } else {
                this.$el.html(_.template(MainTemplate));

                icon = $('#loginPanel .iconEmployee');
                log = $('#loginPanel  #userName');

                if (App.currentUser && App.currentUser.profile && App.currentUser.profile.profileName === 'baned') {
                    $('title').text('EasyERP');
                    this.$el.find('li#userpage').remove();
                    this.$el.find('#top-bar').addClass('banned');
                    this.$el.find('#content-holder').append("<div id = 'banned'><div class='icon-banned'></div><div class='text-banned'><h1>Sorry, this user is banned!</h1><p>Please contact the administrator.</p></div></div>");
                }
                if (App.currentUser.relatedEmployee) {
                    $('#loginPanel .iconEmployee').attr('src', App.currentUser.relatedEmployee.imageSrc);

                    if (App.currentUser.relatedEmployee.name) {
                        $('#loginPanel  #userName').text(App.currentUser.relatedEmployee.name.first + ' ' + App.currentUser.relatedEmployee.name.last);
                    } else {
                        $('#loginPanel  #userName').text(App.currentUser.login);
                    }
                } else {
                    icon.attr('src', App.currentUser.imageSrc);
                    log.text(App.currentUser.login);
                }
            }

            return this;
        }
    });

    return MainView;
});
