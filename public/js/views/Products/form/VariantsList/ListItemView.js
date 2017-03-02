define([
    'Backbone',
    'Underscore',
    'text!templates/Products/form/VariantsList/ListTemplate.html'
], function (Backbone, _, ListTemplate) {
    'use strict';

    var SettingsProductsTypesListItemView = Backbone.View.extend({
        el: '#listTableVariants',

        initialize: function (options) {
            this.collection = options.collection;
            this.id = options.id;
        },

        pushStages: function (stages) {
            this.stages = stages;
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                collection: this.collection,
                id        : this.id
            }));
        }
    });

    return SettingsProductsTypesListItemView;
});
