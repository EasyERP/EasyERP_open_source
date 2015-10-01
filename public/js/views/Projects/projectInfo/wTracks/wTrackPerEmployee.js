/**
 * Created by Roman on 27.04.2015.
 */
define([
	'text!templates/Projects/projectInfo/wTracks/wTrackPerEmployee.html'

], function (template) {
	var View = Backbone.View.extend({
		el: '#wTrackItemsHolder',

		events: {},

		template: _.template(template),

		render: function (options) {
			this.$el.html(this.template(options));

			return this;
		}
	});

	return View;
});