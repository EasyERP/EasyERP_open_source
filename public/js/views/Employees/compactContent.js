define([
    "text!templates/Employees/compactContentTemplate.html",
    "common"
],
    function (compactContentTemplate, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",

            initialize: function () {
                //this.render();
            },

            template: _.template(compactContentTemplate),

            render: function () {
                var collection = this.collection.toJSON();
                this.$el.html(this.template({ collection: collection }));
                return this;
            }
        });

        return compactContentView;
    });