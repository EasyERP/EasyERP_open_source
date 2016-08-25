define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Persons/formProperty/filterView',
    'models/PersonsModel',
    'text!templates/Persons/formProperty/formPropertyTemplate.html'
], function (Backbone, $, _, FilterView, PersonsModel, propertyTemplate) {
    'use strict';
    var selectView = Backbone.View.extend({
        template: _.template(propertyTemplate),

        events: {
            'click #addProperty'   : 'addProperty',
            'click #removeProperty': 'removeProperty'
        },

        initialize: function (options) {
            this.data = options.data;
            this.saveDeal = options.saveDeal;
        },

        addProperty: function () {
            new FilterView({
                saveDeal : this.saveDeal
            });
        },

        removeProperty: function (e) {
            var saveObject = {
                customer : null
            };

            e.preventDefault();

            this.saveDeal(saveObject, 'formProperty');

        },

        render: function () {
            this.$el.html(_.template(propertyTemplate, {property: this.data}));
            return this;
        }
    });

    return selectView;
});
