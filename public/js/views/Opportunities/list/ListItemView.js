define([
    'text!templates/Opportunities/list/ListTemplate.html',
    "common"
],

	   function (OpportunitiesListTemplate, common) {
		   var OpportunitiesListItemView = Backbone.View.extend({
			   el: '#listTable',

			   initialize: function(options) {
				   this.collection = options.collection;
				   this.startNumber = (options.page - 1 ) * options.itemsNumber;//Counting the start index of list items
			   },
			   render: function() {
				   var self= this;
				   this.$el.append(_.template(OpportunitiesListTemplate, { opportunitiesCollection: this.collection.toJSON(), startNumber: this.startNumber }));
			   }
		   });

		   return OpportunitiesListItemView;
	   });
