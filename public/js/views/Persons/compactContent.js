define([
        'Backbone',
        'jQuery',
        'Underscore',
        "text!templates/Persons/compactContentTemplate.html"
    ],
    function (Backbone, $, _, compactContentTemplate) {
        'use strict';
        var compactContentView = Backbone.View.extend({
            className: "form",
            template: _.template(compactContentTemplate),

            events: {
                "click #persons p > a": "gotoPersonsForm"
            },


            gotoPersonsForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                Backbone.history.navigate("#easyErp/Persons/form/" + itemIndex, {trigger: true});
            },

            render: function (options) {
                this.$el.html(this.template({
                    collection: this.collection,
                    options   : options
                }));
                return this;
            }
        });

        return compactContentView;
    });
