/**
 * Created by German on 02.07.2015.
 */
define([
    'text!templates/Attendance/statisticsTemplate.html'
], function (statiscticsBlock) {
    var StatisticsView = Backbone.View.extend({
        el: '#statictics',
        initialize: function (options) {
            this.leaveDays = options.leaveDays;
            this.workingDays = options.workingDays;
            this.vacation = options.vacation;
            this.personal = options.personal;
            this.sick = options.sick;
            this.education = options.education;

            this.lastLeave = options.lastLeave;
            this.lastWorkingDays = options.lastWorkingDays;
            this.lastVacation = options.lastVacation;
            this.lastPersonal = options.lastPersonal;
            this.lastSick = options.lastSick;
            this.lastEducation = options.lastEducation;
        },

        events: {},

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

        render: function () {
            var self = this;
            var percentLeave = self.percentDiff(self.leaveDays,self.lastLeave);
            var percentWork = self.percentDiff(self.workingDays,self.lastWorkingDays);
            var percentVacation = self.percentDiff(self.vacation,self.lastVacation);
            var percentPersonal = self.percentDiff(self.personal,self.lastPersonal);
            var percentSick = self.percentDiff(self.sick,self.lastSick);
            var percentEducation = self.percentDiff(self.education,self.lastEducation);

            self.$el.append(_.template(statiscticsBlock, {
                leaveDays: self.leaveDays,
                workingDays: self.workingDays,
                vacation: self.vacation,
                personal: self.personal,
                sick: self.sick,
                education: self.education,

                lastLeave: self.lastLeave,
                lastWorkingDays: self.lastWorkingDays,
                lastVacation: self.lastVacation,
                lastPersonal: self.lastPersonal,
                lastSick: self.lastSick,
                lastEducation: self.lastEducation,

                percentLeave: percentLeave,
                percentWork: percentWork,
                percentVacation: percentVacation,
                percentPersonal: percentPersonal,
                percentSick: percentSick,
                percentEducation: percentEducation
            }));
        }
    });

    return StatisticsView;
});