define([
    'Underscore',
    'helpers/getVacationHelper',
    'helpers/getHolidayHelper',
    'moment'
], function (_, getVacation, getHoliday, moment) {
    'use strict';

    var getNonWorkingDaysByWeek = function (year, week, month, employee, wtrack, callback, context) {

        getVacation.forEmployeeByWeek(year, week, employee, function (vacations) {

            getHoliday.byWeek(year, week, function (holidays) {
                var nonWorkingDays = {};
                var workingHours = 0;
                var _endDay = 7;
                var _startDay = 1;
                var _date;
                var _monDate;
                var _satDate;
                var _secondStartDate;
                var _dateEl;
                var vacation;
                var holiday;
                var i;

                if (month) {
                    _date = moment().isoWeekYear(year).month(month - 1).isoWeek(week);
                } else {
                    _date = moment().isoWeekYear(year).isoWeek(week);
                }

                _monDate = moment(_date).day(1);
                _satDate = moment(_date).day(7);

                if (_monDate.month() !== _satDate.month()) {
                    _endDay = _monDate.endOf('month').day();
                    _secondStartDate = moment(_satDate).startOf('month');

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

                    if (month) {
                        _dateEl = _.filter(nonWorkingDays.splited, function (el) {
                            return el.month === parseInt(month, 10);
                        });

                        if (_dateEl) {
                            _startDay = _dateEl[0].startDay;
                            _endDay = _dateEl[0].endDay;
                        }

                        delete nonWorkingDays.splited;
                    }
                }

                nonWorkingDays.workingHours = 0;

                for (i = 1; i <= 7; i++) {
                    vacation = vacations[i];
                    holiday = holidays[i];

                    if (nonWorkingDays.splited) {
                        vacation = vacation || holiday;
                    } else {
                        vacation = (i <= _endDay && i >= _startDay) ? (vacation || holiday) : 'disabled';
                    }

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

