/**
 * Created by German on 30.06.2015.
 */
define([
    'text!templates/Attendance/index.html',
    'models/AttendanceModel',
    'views/Attendance/MonthView',
    'views/Attendance/StatisticsView',
    'populate',
    'moment',
    'dataService'
], function (mainTemplate, AttendanceModel, MonthView, StatisticsView, populate, moment, dataService) {
    var View = Backbone.View.extend({
        el: '#content-holder',

        template: _.template(mainTemplate),

        events: {
            'change #currentEmployee': 'changeEmployee',
            'change #currentStatus': 'changeStatus',
            'change #currentTime': 'changeTime'
        },

        initialize: function () {
            var self = this;
            var employees;
            var status;
            var years;

            this.currentEmployee = null;
            this.currentStatus = null;
            this.currentTime = null;

            this.model = new AttendanceModel();
            this.listenTo(this.model, 'change:currentEmployee', this.changeEmployee);
            //this.listenTo(this.model, 'change:currentStatus', this.changeStatus);
            //this.listenTo(this.model, 'change:currentTime', this.changeTime);

            dataService.getData("/getPersonsForDd", {}, function (result) {
                var yearToday = moment().year();
                employees = result.data;
                self.model.set({
                    employees: employees
                });

                status = self.model.get('status');
                years = self.model.get('years');
                self.currentEmployee = employees[0];
                self.currentStatus = status[0];
                self.currentTime = years[0];

                while (years.indexOf(yearToday) === -1) {
                    years.push(years[years.length - 1] + 1);
                }

                self.render();

                self.model.set({
                    currentEmployee: self.currentEmployee,
                    currentStatus: self.currentStatus,
                    currentTime: self.currentTime,
                    years: years
                });

            });
        },

        changeEmployee: function () {
            var startTime = new Date();
            var self = this;
            var labels;
            var month;
            var data;
            var keys;

            this.currentEmployee = this.$el.find("#currentEmployee option:selected").attr('id');

            if (!self.currentEmployee) {
                self.currentEmployee = self.model.get('employees')[0].id;
            }

            dataService.getData("/vacation/attendance", {
                year: self.currentTime,
                employee: self.currentEmployee
            }, function (result) {
                labels = self.model.get('labelMonth');
                month = new MonthView();

                data = _.groupBy(result.data, "year");
                keys = Object.keys(data);

                keys.forEach(function (key) {
                    data[key] = _.groupBy(data[key], 'month');
                });

                self.$el.append(month.render({
                    labels: labels,
                    year: self.currentTime,
                    attendance: data,
                    statistic: result.stat,
                    startTime: startTime
                }));
            });
        },

        changeStatus: function () {
            var self = this;
            self.currentStatus = this.$el.find("#currentStatus option:selected").attr('id');

            dataService.getData("/getPersonsForDd", {}, function (result) {
                //ToDo Hired and Not Hired
            });
        },

        changeTime: function () {
            var startTime = new Date();
            var self = this;
            var labels;
            var month;
            var data;
            var keys;

            self.currentTime = this.$el.find("#currentTime option:selected").text().trim();

            if (!self.currentTime) {
                self.currentTime = self.model.get('years')[0].id;
            }

            dataService.getData("/vacation/attendance", {
                year: self.currentTime,
                employee: self.currentEmployee
            }, function (result) {
                labels = self.model.get('labelMonth');
                month = new MonthView();

                data = _.groupBy(result.data, "year");
                keys = Object.keys(data);

                keys.forEach(function (key) {
                    data[key] = _.groupBy(data[key], 'month');
                });

                self.$el.append(month.render({
                    labels: labels,
                    year: self.currentTime,
                    attendance: data,
                    statistic: result.stat,
                    startTime: startTime
                }));
            });
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