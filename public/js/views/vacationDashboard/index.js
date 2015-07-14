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
        expandAll: false,

        events: {
            "click .openAll": "openAll",
            "click .employeesRow": "openEmployee",
            "click .group": "openDepartment"
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

        openAll: function(e) {
            var self = this;
            var rows = self.$el.find('tr');
            var length = rows.length;
            var employeeRows = self.$el.find("tr[data-content='employee']");
            var projectsRows = self.$el.find("tr[data-content='project']");
            var countEmployees = employeeRows.length;
            var countProjects = projectsRows.length;

            if (!self.expandAll) {
                for (var i = length; i >= 0; i--) {
                    rows.eq(i).show();
                }

                self.$el.find('.icon').text('-');
                self.expandAll = true;
            } else {
                for (var i = countEmployees; i >= 0; i--) {
                    employeeRows.eq(i).hide();
                }
                for (var i = countProjects; i >= 0; i--) {
                    projectsRows.eq(i).hide();
                }

                self.$el.find('.icon').text('5');
                self.expandAll = false;
            }
        },

        openEmployee: function(e) {
            var self = this;
            var target = e.target;
            var targetIcon = $(e.target);
            var targetEmployee = '.' + $(target).parents('tr').attr('data-id');
            var display = self.$el.find(targetEmployee).css('display');

            if (display === "none") {
                self.$el.find(targetEmployee).show();
                targetIcon.text('-');
            } else {
                self.$el.find(targetEmployee).hide();
                targetIcon.text('5');
            }
        },

        openDepartment: function(e) {
            var self = this;
            var target = e.target;
            var targetDepartment = '.' + $(target).parents('tr').attr('data-id');
            var targetProjects = '.projectsFor' + $(target).parents('tr').attr('data-id');
            var display = self.$el.find(targetDepartment).css('display');

            if (display === "none") {
                self.$el.find(targetDepartment).show();
            } else {
                self.$el.find(targetDepartment).hide();
                self.$el.find(targetProjects).hide();
            }
        },

        leadComparator: function(isLeadNumber){
            if (!isLeadNumber){
                return '<span class="low"><span class="label label-danger">Low</span></span>'
            }
            if (isLeadNumber == 1){
                return '<span class="medium"><span class="label label-warning">Medium</span></span>'
            }
            return '<span class="high"><span class="label label-success">High</span></span>'
        },

        getCellClass: function(week, employeeId){
           /* var s = "";
            var hours = week.hours + self.isHaveHoliday(week.year, week.week) * 8 + (week.countDay || 0);
            if (hours > 40) {
                s += "dgreen ";
            } else if (hours > 35) {
                s += "green ";
            } else if (hours > 19) {
                s += "yellow ";
            } else
                s += "white ";
            if (self.currentWeek == week.week) {
                s += "active ";
            }
            if (!self.isWorking(track.ID, week)) {
                s += "inactive ";
            }
            return s;*/
        },

        render: function () {
            var self = this;
            var rowItems;
            var weeskArr = custom.retriveFromCash('weeksArr') || [];
            var dashboardData = this.dashCollection.toJSON();


            this.$el.html(this.template({
                weeks: weeskArr,
                dashboardData:  dashboardData,
                leadComparator: self.leadComparator,
                getCellClass: self.getCellClass
            }));


            return this;
        }
    });

    return View;
});