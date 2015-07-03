/**
 * Created by German on 03.07.2015.
 */
define([
    'text!templates/vacationDashboard/mainTemplate.html',
    'models/VacationDashboardModel',
    'views/vacationDashboard/rowView',
    'populate',
    'moment',
    'dataService'
], function (mainTemplate, vacationDashboardModel, rowView, populate, moment, dataService) {
    var View = Backbone.View.extend({
        el: '#content-holder',

        template: _.template(mainTemplate),

        events: {

        },

        initialize: function () {

        },

        render: function () {
            var self = this;

            this.$el.html(this.template(self.model.toJSON()));

            this.rendered = true;

            return this;
        }
    });

    return View;
});