/**
 * Created by German on 03.07.2015.
 */
define([
    'text!templates/vacationDashboard/index.html',
    'views/vacationDashboard/rowView',
    'collections/Dashboard/vacationDashboard',
    'collections/Dashboard/employeesForDashboard',
    'dataService',
    'constants',
    'async',
    'custom'
], function (mainTemplate, rowView, vacationDashboard, employeesForDashboard, dataService, CONSTANTS, async, custom) {
    var View = Backbone.View.extend({
        el: '#content-holder',

        template: _.template(mainTemplate),

        events: {

        },

        initialize: function () {
            var dashCollection;
            var employeeCollection;
            var self = this;

            dashCollection = this.dashCollection = custom.retriveFromCash('dashboardVacation');

            if(!dashCollection){
                dashCollection = this.dashCollection = new vacationDashboard();
                dashCollection.on('reset sort', this.render, this);

                custom.cashToApp('dashboardVacation', dashCollection);
            } else {
                dashCollection.trigger('reset');
            }
        },

        leadComperator: function(isLeadNumber){
            if (!isLeadNumber){
                return '<span class="low"><span class="label label-danger">Low</span></span>'
            }
            if (isLeadNumber == 1){
                return '<span class="medium"><span class="label label-warning">Medium</span></span>'
            }
            return '<span class="high"><span class="label label-success">High</span></span>'
        },

        render: function () {
            var self = this;
            var rowItems;
            var weeskArr = custom.retriveFromCash('weeksArr') || [];
            var dashboardData = this.dashCollection.toJSON();


            this.$el.html(this.template({weeks: weeskArr, dashboardData:  dashboardData, leadComperator: self.leadComperator}));


            return this;
        }
    });

    return View;
});