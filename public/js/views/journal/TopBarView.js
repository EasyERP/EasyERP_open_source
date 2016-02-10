define([
        'Underscore',
        'views/topBarViewBase',
        'text!templates/journal/TopBarTemplate.html',
        'custom',
        'constants'
    ],
    function (_, BaseView, ContentTopBarTemplate, Custom, CONSTANTS) {
        'use strict';

        var TopBarView = BaseView.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.JOURNAL,
            template   : _.template(ContentTopBarTemplate),

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
