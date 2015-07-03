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
    'dataService',
    'async'
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
            this.listenTo(this.model, 'change:currentStatus', this.changeStatus);
            this.listenTo(this.model, 'change:currentTime', this.changeTime);

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
                    currentEmployee: this.currentEmployee,
                    currentStatus: this.currentStatus,
                    currentTime: this.currentTime,
                    years: years
                });

            });
        },

        changeEmployee: function () {
            var self = this;
            var labels;
            var month;
            var data;

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
                data = _.groupBy(result, "month");
                self.$el.append(month.render({labels: labels, month: this.month, attendance: data}));
            });
        },

        changeStatus: function () {
            var self = this;
            self.currentStatus = this.$el.find("#currentStatus option:selected").attr('id');

            dataService.getData("/getPersonsForDd", {}, function (result) {
            });
        },

        changeTime: function () {
            var self = this;
            var labels;
            var month;
            var data;

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
                data = _.groupBy(result, "month");
                self.$el.append(month.render({labels: labels, month: this.month, attendance: data}));
            });
        },

        percentDiff: function (now, last) {
            var numberPercent = 0;
            var onePercent = 0;
            if (now < last) {
                onePercent = last / 100;
                numberPercent = now / onePercent;
                numberPercent = "DOWN " + Math.abs(Math.ceil(100 - numberPercent)) + "%";
            } else {
                if (last === 0) {
                    numberPercent = "UP " + Math.ceil(now * 100) + "%";
                } else {
                    onePercent = last / 100;
                    numberPercent = (now - last) / onePercent;
                    numberPercent = "UP " + Math.ceil(numberPercent) + "%";
                }
            }
            return numberPercent;
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