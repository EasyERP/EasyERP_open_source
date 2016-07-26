define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Opportunities/CreateView',
    'models/OpportunitiesModel',
    'text!templates/Opportunities/formProperty/formPropertyTemplate.html',
    'dataService',
    'helpers'
], function (Backbone, $, _, CreateView, PersonsModel, propertyTemplate, dataService, helpers) {
    'use strict';
    var selectView = Backbone.View.extend({
        template: _.template(propertyTemplate),

        events: {
            'click #addProperty'   : 'addProperty',
            'click #removeProperty': 'removeProperty'
        },

        initialize: function (options) {
            var self = this;

            this.attribute = options.attribute;
            this.parentModel = options.parentModel;
          /*  this.saveModel = options.saveModel;*/
            this.isLead = options.isLead;
            this.data = [];


        },

        addProperty: function () {
            new CreateView({
                parentModel    : this.parentModel
            });
        },
        /*
         removeProperty: function (e) {
         var saveObject = {};
         var self = this;

         e.preventDefault();

         saveObject[this.attribute] = null;
         this.saveDeal(saveObject, 'formProperty');


         if (this.isLead && this.model.get('isHidden')){
         this.model.destroy({success : function (){
         self.saveDeal(saveObject, 'formProperty');
         }});
         }
         },*/

        render: function () {
            var self = this;

            self.$el.html(_.template(propertyTemplate, {model: this.parentModel.toJSON(), currencySplitter: helpers.currencySplitter}));

            return this;
        }
    });

    return selectView;
});
