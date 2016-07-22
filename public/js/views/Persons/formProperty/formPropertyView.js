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
            var person;
            this.attribute = options.attribute;
            this.parentModel = options.parentModel;
            this.saveDeal = options.saveDeal;
            this.isLead = options.isLead;
            person = this.parentModel.get(this.attribute);
            if (person){
                this.model = new PersonsModel(person);
            }

        },

        addProperty: function () {
            new FilterView({
                model    : this.parentModel,
                attribute: this.attribute,
                saveDeal : this.saveDeal,
                isLead   : this.isLead
            });
        },

        removeProperty: function (e) {
            var saveObject = {};

            e.preventDefault();

            saveObject[this.attribute] = null;
            this.saveDeal(saveObject, 'formProperty');

            if (this.isLead){
                this.model.destroy();
            }
        },

        render: function () {
            var person = this.model ? this.model.toJSON() : '';
            this.$el.html(_.template(propertyTemplate, {property: person}));
            return this;
        }
    });

    return selectView;
});
