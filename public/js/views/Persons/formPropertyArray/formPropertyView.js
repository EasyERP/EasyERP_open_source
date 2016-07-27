define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Persons/formPropertyArray/filterView',
    'models/PersonsModel',
    'text!templates/Persons/formPropertyArray/formPropertyTemplate.html'
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
            var $target = $(e.target);
            var id = $target.attr('data-id');
            var saveObject = {};
            var self = this;
            var person;

            e.preventDefault();

            person = new PersonsModel({id : id});
            person.save({company : null}, function (err, res){
                Backbone.history.fragment = '';
                Backbone.history.navigate(window.location.hash, {trigger: true});
            });
        },

        render: function () {
            var persons = this.parentModel.get('contacts');
            this.$el.html(_.template(propertyTemplate, {data: persons}));
            return this;
        }
    });

    return selectView;
});
