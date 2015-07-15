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
    'custom',
    'moment'
], function (mainTemplate, rowView, vacationDashboard, employeesForDashboard, dataService, CONSTANTS, async, custom, moment) {
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
            var startWeek;
            var self = this;
            var year;
            var week;

            dashCollection = this.dashCollection = custom.retriveFromCash('dashboardVacation');

            if(!dashCollection){
                dashCollection = this.dashCollection = new vacationDashboard();
                dashCollection.on('reset sort', this.render, this);

                custom.cashToApp('dashboardVacation', dashCollection);
            } else {
                dashCollection.trigger('reset');
            }

            year = moment().isoWeekYear();
            week = moment().isoWeek();

            this.dateByWeek = year * 100 + week;
            this.week = week;
            this.year = year;
            startWeek = this.week - 6;

            if(startWeek >= 0){
                this.startWeek = startWeek;
            } else {
                this.startWeek = startWeek + 53;
                this.year -= 1;
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

        getCellClass: function(week){
            var s = "";
            var hours = week.hours || 0;
            var holidays = week.holidays ||0;
            var vacations = week.vacations ||0;
            var hours = hours || + (holidays + vacations) * 8;

            if (hours > 40) {
                s += "dgreen ";
            } else if (hours > 35) {
                s += "green ";
            } else if (hours > 19) {
                s += "yellow ";
            } else {
                s += "white ";
            }
            if (this.dateByWeek === week.dateByWeek) {
                s += "active ";
            }
           /* if (!self.isWorking(track.ID, week)) {
                s += "inactive ";
            }*/
            return s;
        },

        getDate: function (num) {
            return moment().day("Monday").week(num).format("DD.MM");
        },

        render: function () {
            var self = this;
            var rowItems;
            var weeksArr = custom.retriveFromCash('weeksArr') || [];
            var week;
            var startWeek = this.startWeek;
            var dashboardData = this.dashCollection.toJSON();

            if(!weeksArr || !weeksArr.length){
                for (var i = 0; i <= 13; i++) {
                    if (startWeek + i > 53) {
                        week = startWeek + i - 53;
                        weeksArr.push({
                            lastDate: this.getDate(week),
                            week: week,
                            year: this.year + 1
                        });
                    } else {
                        week = startWeek + i;
                        weeksArr.push({
                            lastDate: this.getDate(week),
                            week: week,
                            year: this.year
                        });
                    }
                }

                custom.cashToApp('weeksArr', weeksArr);
            }

            this.$el.html(this.template({
                weeks: weeksArr,
                dashboardData:  dashboardData,
                leadComparator: self.leadComparator,
                getCellClass: self.getCellClass
            }));


            return this;
        }
    });

    return View;
});