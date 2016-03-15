define([
    'helpers/getVacationHelper',
    'helpers/getHolidayHelper',
    'moment'
], function (getVacation, getHoliday, moment) {
    'use strict';

    var getNonWorkingDaysByWeek = function (year, week, month, employee, wtrack, callback, context) {

        getVacation.forEmployeeByWeek(year, week, employee, function (vacations) {

            getHoliday.byWeek(year, week, function (holidays) {
                var nonWorkingDays = {};
                var _date = moment().isoWeekYear(year).isoWeek(week);
                var workingHours = 0;
                var _endDay = 7;
                var _monDate;
                var _satDate;
                var _secondStartDate;
                var vacation;
                var holiday;
                var i;

                if (month) {
                    _date.month(month - 1);
                }

                _monDate = moment(_date).day(1);
                _satDate = moment(_date).day(7);

                if (_monDate.month() !== _satDate.month()) {
                    _endDay = _monDate.endOf('month').day();
                    _secondStartDate = moment(_satDate).startOf('month');
                    if (!month) {
                        nonWorkingDays.splited = [{
                            startDay: 1,
                            endDay  : _endDay,
                            month   : _monDate.month() + 1,
                            year    : _monDate.year()
                        }, {
                            startDay: _secondStartDate.day(),
                            endDay  : 7,
                            month   : _satDate.month() + 1,
                            year    : _satDate.year()
                        }];
                    }
                }

                nonWorkingDays.workingHours = 0;

                for (i = 1; i <= 7; i++) {
                    vacation = vacations[i];
                    holiday = holidays[i];

                    vacation = i <= _endDay ? (vacation || holiday) : 'disabled';

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

