/**
 * Created by Roman on 27.04.2015.
 */
define([
    'text!templates/Projects/projectInfo/wTracks/wTrackPerEmployee.html'

], function (template) {
    var View = Backbone.View.extend({
        /*el: '#wTrackItemsHolder',*/
        className: 'rawValue',
        events   : {},

        template: _.template(template),

        render: function (options) {
            var thisEl = this.$el;

            thisEl.html(this.template(options));
            thisEl.attr('data-id', 'rawValue');

            return this;
        }
    });

    return View;
});