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

        $currentEmployee: null,
        $currentStatus: null,
        $currentTime: null,

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

            this.model = new AttendanceModel();
            this.listenTo(this.model, 'change:currentEmployee', this.changeEmployee);
            this.listenTo(this.model, 'change:currentStatus', this.changeStatus);
            this.listenTo(this.model, 'change:currentTime', this.changeTime);

            dataService.getData("/getPersonsForDd", {}, function (result) {
                employees = result.data;
                self.model.set({
                    employees: employees
                });

                status = self.model.get('status');
                years = self.model.get('years');
                $currentEmployee = employees[0];
                $currentStatus = status[0];
                $currentTime = years[0];

                while (years.indexOf(moment().year()) == -1) {
                    years.push(years[years.length - 1] + 1);
                }

                self.model.set({
                    currentEmployee: $currentEmployee,
                    currentStatus: $currentStatus,
                    currentTime: $currentTime,
                    years: years
                });
                self.render();
            });
        },

        changeEmployee: function () {
            var self = this;
            $currentEmployee = $("#currentEmployee option:selected").attr('id');

            if (!$currentEmployee) {
                $currentEmployee = self.model.get('employees')[0].id;
            }

            dataService.getData("/vacation/attendance", {year: $currentTime, employee: $currentEmployee}, function (result) {

            });
        },

        changeStatus: function () {
            var self = this;
            $currentStatus = $("#currentStatus option:selected").attr('id');

            dataService.getData("/getPersonsForDd", {}, function (result) {});
        },

        changeTime: function () {
            var self = this;
            $currentTime = $("#currentTime option:selected").attr('id');

            if (!$currentTime) {
                $currentTime = self.model.get('years')[0].id;
            }

            dataService.getData("/vacation/attendance", {year: $currentTime, employee: $currentEmployee}, function (result) {

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
                if (last == 0) {
                    numberPercent = "UP " + Math.ceil(now * 100) + "%";
                } else {
                    onePercent = last / 100;
                    numberPercent = (now - last) / onePercent;
                    numberPercent = "UP " + Math.ceil(numberPercent) + "%";
                }
            }
            return numberPercent;
        },

        render: function (attendance) {
            var self = this;
            var labels = self.model.get('labelMonth');

            this.$el.html(this.template(self.model.toJSON()));

            var month = new MonthView({labels: labels,month: this.month, attendance: attendance});
            self.$el.append(month.render());

            var statictics = new StatisticsView({month: this.month, attendance: attendance});
            self.$el.append(statictics.render());

            this.rendered = true;

            return this;
        }
    });

    return View;
});