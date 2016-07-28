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
           this.model = new PersonsModel();

            this.attribute = options.attribute;
            this.parentModel = options.parentModel;
            this.saveDeal = options.saveDeal;
            this.isLead = options.isLead;

        },

        addProperty: function () {
            new FilterView({
                model    : this.model,
                company  : this.parentModel.id,
                saveDeal : this.saveDeal,
                isLead   : this.isLead
            });
        },

        removeProperty: function (e) {
            var $target = $(e.target);
            var id = $target.closest('.propertyBox').attr('data-id');

            e.preventDefault();

            this.model.set({_id : id});
            this.model.save({company : null}, {
                validate : false,
                patch : true,
                success : function (err, res){
                Backbone.history.fragment = '';
                Backbone.history.navigate(window.location.hash, {trigger: true});
            }});
        },

        render: function () {
            var persons = this.parentModel.get('contacts');
            this.$el.html(_.template(propertyTemplate, {data: persons}));
            return this;
        }
    });

    return selectView;
});
