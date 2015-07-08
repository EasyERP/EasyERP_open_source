/**
 * Created by German on 03.07.2015.
 */
define([
    'text!templates/vacationDashboard/index.html',
    'views/vacationDashboard/rowView',
    'custom'
], function (mainTemplate, rowView, custom) {
    var View = Backbone.View.extend({
        el: '#content-holder',

        template: _.template(mainTemplate),

        events: {

        },

        initialize: function () {
            this.render();
        },

        render: function () {
            var self = this;
            var weeskArr = custom.retriveFromCash('weeksArr') || [];

            this.$el.html(this.template({weeks: weeskArr}));

            new rowView();

            return this;
        }
    });

    return View;
});