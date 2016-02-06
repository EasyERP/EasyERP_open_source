define([
        'Backbone',
        'jQuery',
        'common',
        'custom'
    ],
    function (Backbone, $, Common, Custom) {
        'use strict';
        var TopBarView = Backbone.View.extend({
            el        : '#top-bar',
            actionType: null, //Content, Edit, Create

            events: {
                "click .changeContentView"     : 'onChangeContentViewType',
                "click ul.changeContentIndex a": 'onChangeItemIndex',
                "click #top-bar-nextBtn"       : "onNextEvent",
                "click #top-bar-deleteBtn"     : "onDeleteEvent",
                "click #top-bar-createBtn"     : "onCreateEvent",
                "click #top-bar-discardBtn"    : "onDiscardEvent",
                "click #top-bar-editBtn"       : "onEditEvent",
                "click #top-bar-saveBtn"       : "onSaveEvent",
                "click #kanban-settings-Btn"   : "onEditKanban"
            },

            initialize: function (options) {
                this.actionType = options.actionType || 'Content';

                this.render();
            },

            onChangeContentViewType: function (e) {
                e.preventDefault();
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            onChangeItemIndex: function (e) {
                var actionType = "Content";

                Custom.changeItemIndex(e, actionType, this.contentType, this.collection);
            },

            onNextEvent: function (event) {
                event.preventDefault();
                this.trigger('nextEvent');
            },

            onCreateEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },

            onDiscardEvent: function (event) {
                event.preventDefault();
                Backbone.history.navigate("home/content-" + this.contentType, {trigger: true});
            },

            onEditEvent: function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },

            onSaveEvent: function (event) {
                event.preventDefault();
                this.trigger('saveEvent');
            },

            onDeleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Really DELETE items ?!");

                if (answer) {
                    this.trigger('deleteEvent');
                }
            },

            onEditKanban: function (event) {
                event.preventDefault();
                this.trigger('editKanban');
            },

            render: function () {
                var viewType = Custom.getCurrentVT();

                $('title').text(this.contentType);
                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

                Common.displayControlBtnsByActionType(this.actionType, viewType);

                return this;
            }
        });

        return TopBarView;
    });
