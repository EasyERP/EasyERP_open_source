define([
    'helpers/getVacationHelper',
    'helpers/getHolidayHelper',
    'moment'
], function (getVacation, getHoliday, moment) {
    'use strict';

    var getNonWorkingDaysByWeek = function (year, week, employee, wtrack, callback, context) {

        getVacation.forEmployeeByWeek(year, week, employee, function (vacations) {

            getHoliday.byWeek(year, week, function (holidays) {
                var nonWorkingDays = {};
                var _date = moment().isoWeekYear(year).isoWeek(week).day(1);
                var _endDay = _date.endOf('month').day();
                var workingHours = 0;
                var vacation;
                var holiday;
                var i;

                nonWorkingDays.workingHours = 0;

                for (i = 1; i <= 7; i++) {
                    vacation = vacations[i];
                    holiday = holidays[i];

                    vacation = i < _endDay ? (vacation || holiday) : 'disabled';

                    if (vacation) {
                        nonWorkingDays[i] = vacation;
                    } else if (wtrack) {
                        workingHours = wtrack.get([i]);
                        nonWorkingDays.workingHours += workingHours;

                        nonWorkingDays[i] = workingHours || '';
                    } else {
                        nonWorkingDays[i] = '';
                    }
                }

                callback(nonWorkingDays, context);
            });
        });
    };

    return {
        getNonWorkingDaysByWeek: getNonWorkingDaysByWeek
    };
});