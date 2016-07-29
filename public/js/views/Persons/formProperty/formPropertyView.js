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
            this.isLead = options.isLead;
        },

        addProperty: function () {
            new FilterView({
                attribute: this.attribute,
                saveDeal : this.saveDeal,
                isLead   : this.isLead
            });
        },

        removeProperty: function (e) {
            var saveObject = {
                customer : null
            };
            var model = new PersonsModel(this.data);

            var self = this;

            e.preventDefault();

            if (this.isLead && this.data.isHidden){
                model.destroy({success : function (){
                    self.saveDeal(saveObject, 'formProperty');
                }});
            } else {
                this.saveDeal(saveObject, 'formProperty');
            }
        },

        render: function () {
            this.$el.html(_.template(propertyTemplate, {property: this.data}));
            return this;
        }
    });

    return selectView;
});
