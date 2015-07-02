/**
 * Created by German on 30.06.2015.
 */
define([
    'text!templates/Attendance/monthTemplate.html'
], function (ListTemplate) {
    var MonthView = Backbone.View.extend({
        el: '#attendanceMonth',
        initialize: function (options) {
            this.labels = options.labels;
            this.type = options.type;
            this.days = options.attendance;

            this.generateMonthArray();
        },

        events: {},

        generateMonthArray: function () {
            var number;
            var self = this;
            var startMonth = 0;

            if (self.type == 'Line Year') {
                self.monthArray = new Array(13);
                startMonth = moment().month();
            } else {
                self.monthArray = new Array(12);
                startMonth = 0;
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

            for (var i = 0; i < self.monthArray.length; i++) {
                var monthYear;

                if (currentInterval == 'Line Year') {
                    if (i < (self.monthArray.length - self.startMonth - 1)) {
                        monthYear = moment().year() - 1;
                    }
                    if (i >= (self.monthArray.length - self.startMonth - 1)) {
                        monthYear = moment().year();
                    }
                } else {
                    monthYear = currentInterval;
                }

                var monthNumber = moment().set('year', monthYear).set('month', self.monthArray[i].label).months();
                if (monthNumber > 11) {
                    monthNumber = monthNumber - 12;
                }
                var startOfMonth = new Date(monthYear, monthNumber, 1);
                startOfMonth = startOfMonth.getDay();
                if (startOfMonth === 0) {
                    startOfMonth = 7;
                }

                var dayCount = moment().set('year', monthYear).set('month', monthNumber).endOf('month').dates();

                var dayNumber = 1;

                self.monthCur = _.filter(self.dataDays, function (item) {
                    var currectStartDate = new Date(item.StartDate);
                    var numMonth = moment(currectStartDate).month();
                    var numYear = moment(currectStartDate).year();

                    if (numMonth == monthNumber && numYear == monthYear) {
                        return item;
                    }
                });
                for (var j = startOfMonth; j < startOfMonth + dayCount; j++) {
                    var isType = false;
                    var day = new Date(monthYear, i, j - startOfMonth + 1);
                    day = day.getDay();
                    if (day === 0 || day == 6) {
                        self.weekend++;
                    }
                    self.monthArray[i].daysData[j] = {};
                    self.monthArray[i].daysData[j].number = dayNumber;
                    self.monthArray[i].daysData[j].type = _.find(self.monthCur, function (item) {
                        var currectStartDate = new Date(item.StartDate);
                        var currectEndDate = new Date(item.EndDate);
                        var currentYear = moment(currectStartDate).year();
                        var startDate = moment(currectStartDate).date();
                        var endDate = moment(currectEndDate).date();

                        if (dayNumber >= startDate && dayNumber <= endDate) {
                            isType = true;
                            return item.absenceTypeID;
                        }
                    });

                    dayNumber++;
                }
            }
            if (currentInterval !== 'Line Year') {
                var startYear = moment([currentInterval, 0, 1]);
                var endYear = moment([currentInterval, 11, 31]);
            } else {
                var dayCount = moment().set('year', moment().year()).set('month', moment().month()).endOf('month').dates();
                var startYear = moment([moment().year() - 1, moment().month(), 1]);
                var endYear = moment([moment().year(), moment().month(), dayCount]);
            }
            self.daysLeave = self.vacationDays + self.personalDays + self.sickDays + self.educationDays;
            self.workingDays = endYear.diff(startYear, 'days') - self.daysLeave - self.weekend;
        },

        render: function () {
            this.$el.append(_.template(ListTemplate, {
                months: this.monthArray
            }));
        }
    });

    return MonthView;
});