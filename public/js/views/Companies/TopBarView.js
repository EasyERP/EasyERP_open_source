define([
        'Underscore',
        'views/topBarViewBase',
        'text!templates/Companies/TopBarTemplate.html',
        'text!templates/Notes/importTemplate.html',
        'custom'
    ],
    function (_, BaseView, ContentTopBarTemplate, importTemplate, Custom) {
        'use strict';

        var TopBarView = BaseView.extend({
            el            : '#top-bar',
            contentType   : "Companies",
            actionType    : null,
            template      : _.template(ContentTopBarTemplate),
            importTemplate: _.template(importTemplate),

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