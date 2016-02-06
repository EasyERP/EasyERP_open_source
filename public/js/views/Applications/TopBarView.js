define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/Applications/TopBarTemplate.html',
        'custom',
        'common'
    ],
    function (Backbone, $, _, ContentTopBarTemplate, Custom, common) {
        'use strict';

        var TopBarView = Backbone.View.extend({
            el              : '#top-bar',
            contentType     : "Applications",
            actionType      : null,
            collectionLength: 0,
            template        : _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView"    : 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn"     : "deleteEvent",
                "click #top-bar-discardBtn"    : "discardEvent",
                "click #top-bar-editBtn"       : "editEvent",
                "click #top-bar-createBtn"     : "createEvent",
                "click #kanban-settings-Btn"   : "editKanban"
            },

            editEvent  : function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },
            createEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },

            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            changeItemIndex: function (e) {
                var actionType = "Content";
                Custom.changeItemIndex(e, actionType, this.contentType, this.collection);
            },

            initialize: function (options) {
                this.actionType = options.actionType;
                if (this.actionType !== "Content") {
                    Custom.setCurrentVT("form");
                }
                if (options.collection) {
                    this.collection = options.collection;
                    this.collection.bind('reset', _.bind(this.render, this));
                }
                this.render();
            },

            render: function () {
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));
                common.displayControlBtnsByActionType(this.actionType, viewType);

                return this;
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Really DELETE items ?!");
                if (answer === true) {
                    this.trigger('deleteEvent');
                }
            },

            discardEvent: function (event) {
                event.preventDefault();
                Backbone.history.navigate("home/content-" + this.contentType, {trigger: true});
            },
            editKanban  : function (event) {
                event.preventDefault();
                this.trigger('editKanban');
            }
        });
        return TopBarView;
    });