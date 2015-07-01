/**
 * Created by German on 30.06.2015.
 */
define([
    'text!templates/Attendance/index.html',
    'models/AttendanceModel',
    'views/Attendance/MonthView',
    'moment',
    'dataService',
    'async'
], function (mainTemplate, AttendanceModel, MonthView, moment, dataService, async) {
    var View = Backbone.View.extend({
        el: '#content-holder',

        template: _.template(mainTemplate),

        $currentEmployee: null,
        $currentStatus: null,
        $currentTime: null,

        events: {
            'change #currentEmployee': 'changeEmployee',
            'change #currentStatus': 'changeEmployee',
            'change #currentTime': 'changeEmployee'
        },

        initialize: function () {
            var self = this;

            this.model = new AttendanceModel();
            this.listenTo(this.model, 'change:currentEmployee', this.changeEmployee);
            this.listenTo(this.model, 'change:currentStatus', this.changeStatus);
            this.listenTo(this.model, 'change:currentTime', this.changeTime);

            while (find(this.model.years,moment().year()) == -1) {
                this.model.years.push(this.model.years.pop() + 1);
            }

            var currentEmployee = this.model.employees[0];
            var currentStatus = this.model.status[0];
            var currentTime = this.model.years[0];

            this.model.set({
                currentEmployee: currentEmployee,
                currentStatus: currentStatus,
                currentTime: currentTime
            });

            dataService.getData('/attendance', {
                ID: currentEmployee._id,
                TIME: currentTime,
                STATUS: currentStatus
            }, function (attendance) {
                self.render(attendance);
            });
        },

        changeEmployee: function () {
            var self = this;

            dataService.getData('/attendance', {ID: id, TIME: time, STATUS: status}, function (attendance) {
                self.render(attendance);
            });
        },

        changeStatus: function () {
            dataService.getData('/employees', {STATUS: status}, function (employees) {
                this.model.employees = employees;
                this.model.currentEmployee = employees[0];
            });
        },

        changeTime: function () {
            var self = this;

            dataService.getData('/attendance', {ID: id, TIME: time, STATUS: status}, function (attendance) {
                self.render(attendance);
            });
        },

        generateMonthArray: function () {
            var number;
            var self = this;

            if (self.model.currentTime == 'Line Year') {
                self.monthArray = new Array(13);
                self.lastMonthArray = new Array(13);
                self.startMonth = moment().month();
            } else {
                self.monthArray = new Array(12);
                self.lastMonthArray = new Array(12);
                self.startMonth = 0;
            }

            for (var i = 0; i < self.monthArray.length; i++) {
                if (self.startMonth + i > 11) {
                    number = self.startMonth + i - 12;
                } else {
                    number = self.startMonth + i;
                }
                self.monthArray.push({
                    label: self.model.labelMonth[number],
                    daysData: new Array(42)
                });
            }
            for (i = 0; i < self.lastMonthArray.length; i++) {
                if (self.startMonth + i > 11) {
                    number = self.startMonth + i - 12;
                } else {
                    number = self.startMonth + i;
                }
                self.lastMonthArray.push({
                    label: self.labelMonth[number],
                    daysData: new Array(42)
                });
            }
        },

        generateMonthData: function() {
            var self = this;


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

            this.$el.html(this.template(model));

            var itemView = new MonthView({month: this.month, attendance: attendance});
            self.$el.append(itemView.render());

            this.rendered = true;

            return this;
        }
    });

    return View;
});