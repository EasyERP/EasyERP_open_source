define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Users/TopBarTemplate.html',
    'custom'
], function (_, BaseView, TopBarTemplate, Custom) {
    'use strict';
    var TopBarView = BaseView.extend({
        contentType     : "Users",
        collectionLength: 0,
        template        : _.template(TopBarTemplate),

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
