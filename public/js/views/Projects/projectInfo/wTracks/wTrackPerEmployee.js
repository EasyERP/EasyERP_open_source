define([
    'Backbone',
    'Underscore',
    'text!templates/Projects/projectInfo/wTracks/wTrackPerEmployee.html'

], function (Backbone, _, template) {
    var View = Backbone.View.extend({
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
