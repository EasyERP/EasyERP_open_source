/**
 * Created by German on 03.07.2015.
 */
/**
 * Created by German on 03.07.2015.
 */
define([
    'text!templates/vacationDashboard/rowTemplate.html',
    'models/VacationDashboardModel',
    'populate',
    'moment'
], function (mainTemplate, vacationDashboardModel, populate, moment) {
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