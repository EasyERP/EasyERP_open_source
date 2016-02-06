define([
        'Backbone',
        'Underscore',
        "text!templates/Employees/compactContentTemplate.html"
    ],
    function (Backbone, _, compactContentTemplate) {
        'use strict';
        var compactContentView = Backbone.View.extend({

            className: "form",

            template: _.template(compactContentTemplate),

            render: function () {
                var collection = this.collection.toJSON();
                this.$el.html(this.template({collection: collection}));
                return this;
            }
        });

        return compactContentView;
    });