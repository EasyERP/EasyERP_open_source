define([
        'Backbone',
        'Underscore',
        'jQuery',
        'text!templates/Workflows/TopBarTemplate.html',
        'custom',
        'common'
    ],
    function (Backbone, _, $, ContentTopBarTemplate, Custom, Common) {
        'use strict';

        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: "Workflows",
            actionType : null, //Content, Edit, Create
            template   : _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView"    : 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-discardBtn"    : "discardEvent",
                "click #top-bar-editBtn"       : "editEvent",
                "click #top-bar-createBtn"     : "createEvent"
            },

            changeContentViewType: Custom.changeContentViewType,

            changeItemIndex: Custom.changeItemIndex,

            initialize: function (options) {
                this.actionType = options.actionType;
                this.render();
            },

            render: function () {
                $('title').text(this.contentType);
                this.$el.html(this.template({contentType: this.contentType}));
                Common.displayControlBtnsByActionType(this.actionType);

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
            createEvent : function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            }
        });

        return TopBarView;
    });
