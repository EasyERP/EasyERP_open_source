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

           /* function employeeComposer(parallelCb){
                employeeCollection = this.employeeCollection = custom.retriveFromCash('employeesByDep');

                if(!employeeCollection){
                    employeeCollection = this.employeeCollection = new employeesForDashboard();

                    custom.cashToApp('employeesByDep', employeeCollection);
                }

                parallelCb(null, employeeCollection);
            };

            function dashboardComposer(parallelCb){
                dashCollection = this.dashCollection = custom.retriveFromCash('dashboardVacation');

                if(!dashCollection){
                    dashCollection = this.dashCollection = new vacationDashboard();

                    custom.cashToApp('dashboardVacation', dashCollection);
                }

                parallelCb(null, dashCollection);
            };

            async.parallel([employeeComposer, dashboardComposer], function(err, result){
                if(!err){
                    self.render();
                }
            });*/

            dashCollection = this.dashCollection = custom.retriveFromCash('dashboardVacation');

            if(!dashCollection){
                dashCollection = this.dashCollection = new vacationDashboard();
                dashCollection.on('reset sort', this.render, this);

                custom.cashToApp('dashboardVacation', dashCollection);
            } else {
                dashCollection.trigger('reset');
            }
        },

        render: function () {
            var self = this;
            var rowItems;
            var weeskArr = custom.retriveFromCash('weeksArr') || [];
            var dashboardData = this.dashCollection.toJSON();
            //var employeeCollection = this.employeeCollection.toJSON();

            this.$el.html(this.template({weeks: weeskArr, dashboardData:  dashboardData}));

            //rowItems = new rowView(dashboardData);

            return this;
        }
    });

    return View;
});