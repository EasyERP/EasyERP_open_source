/**
 * Created by German on 03.07.2015.
 */
define([
    'text!templates/vacationDashboard/rowTemplate.html'
    /*'models/VacationDashboardModel',
    'populate',
    'moment'*/
], function (mainTemplate/*, vacationDashboardModel, populate, moment*/) {
    var View = Backbone.View.extend({
        el: '#dashboardBody',

        template: _.template(mainTemplate),

        events: {

        },

        initialize: function () {
            this.render();
        },

        render: function () {
            var self = this;
            var departments = [{departmentName: 'iOs'}, {departmentName: 'Android'}];

            this.$el.html(this.template({departments: departments}));

            this.rendered = true;

            return this;
        }
    });

    return View;
});