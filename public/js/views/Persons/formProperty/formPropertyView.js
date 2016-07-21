define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Persons/formProperty/filterView',
    'text!templates/Persons/formProperty/formPropertyTemplate.html'
], function (Backbone, $, _, FilterView, propertyTemplate) {
    'use strict';
    var selectView = Backbone.View.extend({
        template: _.template(propertyTemplate),

        events: {
            'click #addProperty'   : 'addProperty',
            'click #removeProperty': 'removeProperty'
        },

        addProperty: function () {
            new FilterView({
                model    : this.parentModel,
                attribute: this.attribute,
                saveDeal : this.saveDeal
            });
        },

        removeProperty: function (e) {
            var saveObject = {};

            e.preventDefault();

            saveObject[this.attribute] = null;
            this.saveDeal(saveObject, 'formProperty');
        },

        initialize: function (options) {
            this.data = options.data;
            this.attribute = options.attribute;
            this.parentModel = options.parentModel;
            this.saveDeal = options.saveDeal;
        },

        render: function () {
            this.$el.html(_.template(propertyTemplate, {property: this.data}));
            return this;
        }
    });

    return selectView;
});
