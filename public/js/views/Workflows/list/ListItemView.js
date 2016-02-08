define([
        'Backbone',
        'Underscore',
        "text!templates/Workflows/list/ListItemTemplate.html"
    ],
    function (Backbone, _, ListItemTemplate) {
        'use strict';
        var ListItemView = Backbone.View.extend({
            tagName  : "div",
            className: "row",

            template: _.template(ListItemTemplate),

            render: function () {
                this.$el.html("");
                this.$el.html(this.template({model: this.model}));
                return this;
            }
        });

        return ListItemView;
    });
