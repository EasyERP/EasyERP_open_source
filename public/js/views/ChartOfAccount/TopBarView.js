define([
        'Underscore',
        'views/topBarViewBase',
        'text!templates/ChartOfAccount/TopBarTemplate.html',
        'custom',
        'constants'
    ],
    function (_, BaseView, ContentTopBarTemplate, Custom, CONSTANTS) {
        'use strict';

        var TopBarView = BaseView.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.CHARTOFACCOUNT,
            template   : _.template(ContentTopBarTemplate),

            events: {
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-saveBtn"  : "saveEvent",
                "click #top-bar-createBtn": "createEvent"
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
            }
        });
        return TopBarView;
    });
