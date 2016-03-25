define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/main/MainTemplate.html',
    'views/menu/LeftMenuView',
    'collections/menu/MenuItems',
    'views/menu/TopMenuView',
    'dataService',
    'constants'
], function (Backbone, _, $, MainTemplate, LeftMenuView, MenuItemsCollection, TopMenuView, dataService, CONSTANTS) {
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
            'click #loginPanel': 'showSelect',
            'click'            : 'hideProp'
        },

        hideProp: function (e) {
            var select;

            if ($(e.target).closest("#loginPanel").length === 0) {
                select = this.$el.find('#loginSelect');
                select.hide();
                select.prop('hidden', true);
            }
        },

        createMenuViews: function () {
            var currentRoot = null;
            var currentChildren = null;
            var currentRootId;

            if (this.contentType) {
                currentChildren = this.collection.where({href: this.contentType});
                currentRootId = currentChildren[0] ? currentChildren[0].get("parrent") : null;
                currentRoot = this.collection.where({_id: currentRootId});
            }

            this.leftMenu = new LeftMenuView({
                collection     : this.collection,
                currentChildren: currentChildren,
                currentRoot    : currentRoot
            });

            this.topMenu = new TopMenuView({
                collection : this.collection.getRootElements(),
                currentRoot: currentRoot,
                leftMenu   : this.leftMenu
            });

            this.topMenu.bind('changeSelection', this.leftMenu.setCurrentSection, {leftMenu: this.leftMenu});
            this.topMenu.bind('mouseOver', this.leftMenu.mouseOver, {leftMenu: this.leftMenu});
        },

        updateMenu     : function (contentType) {
            var currentChildren = this.collection.where({href: contentType});
            var currentRootId = currentChildren[0] ? currentChildren[0].get("parrent") : null;
            var currentRoot = this.collection.where({_id: currentRootId});

            this.leftMenu.updateLeftMenu(currentChildren, currentRoot);
            this.topMenu.updateTopMenu(currentRoot);
        },

        showSelect     : function (e) {
            var select = this.$el.find('#loginSelect');

            if (select.prop('hidden')) {
                select.show();
                select.prop('hidden', false);
            } else {
                select.hide();
                select.prop('hidden', true);
            }
        },

        render         : function () {
            var icon;
            var log;

            if (!App || !App.currentUser || !App.currentUser.login) {

                dataService.getData(CONSTANTS.URLS.CURRENT_USER, null, function (response, context) {
                    var currentUser;

                    currentUser = response.user || {};

                    App.currentUser = currentUser;
                    App.savedFilters = response.savedFilters || {};

                    if (currentUser.profile && currentUser.profile.profileName == 'baned') {
                        $('title').text("EasyERP");
                        context.$el.find("li#userpage").remove();
                        context.$el.find("#top-bar").addClass("banned");
                        context.$el.find("#content-holder").append("<div id = 'banned'><div class='icon-banned'></div><div class='text-banned'><h1>Sorry, this user is banned!</h1><p>Please contact the administrator.</p></div></div>");
                    }
                    if (currentUser && currentUser.relatedEmployee) {
                        $("#loginPanel .iconEmployee").attr("src", currentUser.relatedEmployee.imageSrc);

                        if (currentUser.relatedEmployee.name) {
                            $("#loginPanel  #userName").text(currentUser.relatedEmployee.name.first + " " + currentUser.relatedEmployee.name.last);
                        } else {
                            $("#loginPanel  #userName").text(currentUser.login);
                        }
                    } else {
                        $("#loginPanel .iconEmployee").attr("src", currentUser.imageSrc);
                        $("#loginPanel  #userName").text(currentUser.login);
                    }
                }, this);

                this.$el.html(_.template(MainTemplate));
            } else {
                this.$el.html(_.template(MainTemplate));

                icon = $("#loginPanel .iconEmployee");
                log = $("#loginPanel  #userName");

                if (App.currentUser && App.currentUser.profile && App.currentUser.profile.profileName == 'baned') {
                    $('title').text("EasyERP");
                    this.$el.find("li#userpage").remove();
                    this.$el.find("#top-bar").addClass("banned");
                    this.$el.find("#content-holder").append("<div id = 'banned'><div class='icon-banned'></div><div class='text-banned'><h1>Sorry, this user is banned!</h1><p>Please contact the administrator.</p></div></div>");
                }
                if (App.currentUser.relatedEmployee) {
                    $("#loginPanel .iconEmployee").attr("src", App.currentUser.relatedEmployee.imageSrc);

                    if (App.currentUser.relatedEmployee.name) {
                        $("#loginPanel  #userName").text(App.currentUser.relatedEmployee.name.first + " " + App.currentUser.relatedEmployee.name.last);
                    } else {
                        $("#loginPanel  #userName").text(App.currentUser.login);
                    }
                } else {
                    icon.attr("src", App.currentUser.imageSrc);
                    log.text(App.currentUser.login);
                }
            }

            return this;
        }
    });

    return MainView;
});