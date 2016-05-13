define([
        'Backbone',
        'jQuery',
        'Underscore',
        "text!templates/Birthdays/list/ListItemTemplate.html"
    ],
    function (Backbone, $, _, ListItemTemplate) {
        'use strict';

        var ListItemView = Backbone.View.extend({
            initialize: function (options) {
                this.collection = options.collection;
            },

            events: {
                "click a": "gotoForm"
            },

            gotoForm: function (e) {
                e.preventDefault();
                App.ownContentType = true;
                var id = $(e.target).closest("a").data("id");
                window.location.hash = "#easyErp/Employees/form/" + id;
            },

            template: _.template(ListItemTemplate),

            render: function () {
                this.$el.html(this.template({collection: this.collection}));
                return this;
            }
        });

        return ListItemView;
    });