define([
    'common',
    'text!templates/Leads/list/ListTemplate.html'
],

	   function (common, ListTemplate) {
	       var LeadsListItemView = Backbone.View.extend({
	           el: '#listTable',
	           stages: null,
	           initialize: function (options) {
                   this.collection = options.collection;
	               this.startNumber = (options.page - 1 ) * options.itemsNumber;//Counting the start index of list items
               },
	           events: {
	           },

	           pushStages: function(stages) {
	               this.stages = stages;
	           },

	           render: function () {
	               var self = this;
                   this.$el.append(_.template(ListTemplate, { leadsCollection: this.collection.toJSON(), startNumber: this.startNumber }));
	           }
	       });

	       return LeadsListItemView;
	   });
