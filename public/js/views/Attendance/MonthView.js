/**
 * Created by German on 30.06.2015.
 */
define([
    'text!templates/Attendance/monthTemplate.html',
    'views/Attendance/StatisticsView',
    'moment'
], function (ListTemplate,StatisticsView,moment) {
    var MonthView = Backbone.View.extend({
        el: '#attendanceMonth',

        generateMonthArray: function () {
            var number;
            var self = this;
            var startMonth = 0;

            if (self.year === 'Line Year') {
                self.monthArray = new Array(13);
                self.startMonth = moment().month();
            } else {
                self.monthArray = new Array(12);
                self.startMonth = 0;
            }

            for (var i = 0; i < self.monthArray.length; i++) {
                if (startMonth + i > 11) {
                    number = startMonth + i - 12;
                } else {
                    number = startMonth + i;
                }
                self.monthArray[i] = {
                    label: self.labels[number],
                    daysData: new Array(42)
                };
            }
        },

        generateMonthData: function (currentInterval) {
            var self = this;
            var monthYear;
            var monthNumber;
            var startOfMonth;
            var dayCount;
            var dayNumber;
            var startYear;
            var endYear;
            var keys;

            self.weekend = 0;
            self.vacationDays = 0;
            self.personalDays = 0;
            self.sickDays = 0;
            self.educationDays = 0;

            for (var i = 0; i < self.monthArray.length; i++) {
                dayNumber = 1;

                if (currentInterval === 'Line Year') {
                    if (i >= self.startMonth) {
                        monthYear = moment().year() - 1;
                    } else {
                        monthYear = moment().year();
                    }
                } else {
                    monthYear = currentInterval;
                }

                monthNumber = moment().set('year', monthYear).set('month', self.monthArray[i].label).month();
                if (monthNumber > 11) {
                    monthNumber = monthNumber - 12;
                }

                startOfMonth = new Date(monthYear, monthNumber, 1);
                startOfMonth = startOfMonth.getDay();
                if (startOfMonth === 0) {
                    startOfMonth = 7;
                }

                dayCount = moment().set('year', monthYear).set('month', monthNumber).endOf('month').date();
                self.workingDays += dayCount;

                keys = Object.keys(self.days);
                if (keys.length) {
                    self.monthCur = self.days[monthYear] ? self.days[monthYear][monthNumber] : 0;
                }

                //ToDo review

                for (var j = 0; j < startOfMonth; j++) {
                    self.monthArray[i].daysData[j] = {};
                    self.monthArray[i].daysData[j].number = '&nbsp';
                }

                for (var j = startOfMonth; j < startOfMonth + dayCount; j++) {
                    var day = new Date(monthYear, i, j - startOfMonth + 1);
                    day = day.getDay();
                    if (day === 0 || day === 6) {
                        self.weekend++;
                    }
                    self.monthArray[i].daysData[j] = {};
                    self.monthArray[i].daysData[j].number = dayNumber;
                    dayNumber++;
                }

                for (var j = startOfMonth + dayCount; j < 42; j++) {
                    self.monthArray[i].daysData[j] = {};
                    self.monthArray[i].daysData[j].number = '&nbsp';
                }

                if (self.monthCur) {
                    var countVacation = self.monthCur[0].vacationArray.length;
                    var vacationArray = self.monthCur[0].vacationArray;
                    for (var j = 0; j < countVacation; j++) {
                        var start = moment(vacationArray[j].startDate).date();
                        var end = moment(vacationArray[j].endDate).date();
                        for (var k = start+startOfMonth-1; k <= end+startOfMonth-1; k++) {
                            self.monthArray[i].daysData[k].type = vacationArray[j].vacationType;
                            switch (vacationArray[j].vacationType) {
                                case 'V':
                                    self.vacationDays++;
                                    break;
                                case 'P':
                                    self.personalDays++;
                                    break;
                                case 'S':
                                    self.sickDays++;
                                    break;
                                case 'E':
                                    self.educationDays++;
                                    break;
                            }
                        }
                    }
                }
            }
            if (currentInterval !== 'Line Year') {
                startYear = moment([currentInterval, 0, 1]);
                endYear = moment([currentInterval, 11, 31]);
            } else {
                dayCount = moment().set('year', moment().year()).set('month', moment().month()).endOf('month').date();
                startYear = moment([moment().year() - 1, moment().month(), 1]);
                endYear = moment([moment().year(), moment().month(), dayCount]);
            }
            self.daysLeave = self.vacationDays + self.personalDays + self.sickDays + self.educationDays;
            self.workingDays = endYear.diff(startYear, 'days') - self.daysLeave - self.weekend;
        },

        render: function (options) {
            var self = this;
            self.labels = options.labels;
            self.year = options.year;
            self.days = options.attendance;

            self.generateMonthArray();
            self.generateMonthData(self.year);

            self.$el.html(_.template(ListTemplate, {
                months: this.monthArray
            }));

            var statictics = new StatisticsView({
                leaveDays: self.daysLeave,
                workingDays: self.workingDays,
                vacation: self.vacationDays,
                personal: self.personalDays,
                sick: self.sickDays,
                education: self.educationDays,

                lastLeave: 0,
                lastWorkingDays: 270,
                lastVacation: 7,
                lastPersonal: 8,
                lastSick: 14,
                lastEducation: 4
            });
            self.$el.html(statictics.render());
        }
    });

    return MonthView;
});