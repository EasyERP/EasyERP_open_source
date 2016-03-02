define(['helpers/getVacationHelper', 'helpers/getHolidayHelper'],
    function (getVacation, getHoliday) {
        "use strict";

        var getNonWorkingDaysByWeek = function (year, week, employee, wtrack, callback, context) {

            getVacation.forEmployeeByWeek(year, week, employee, function (vacations) {

                getHoliday.byWeek(year, week, function (holidays) {
                    var nonWorkingDays = {};
                    var workingHours = 0;
                    var vacation;
                    var holiday;
                    var i;

                    nonWorkingDays.workingHours = 0;

                    for (i = 1; i <= 7; i++) {
                        vacation = vacations[i.toString()];
                        holiday = holidays[i.toString()];

                        vacation = vacation || holiday;

                        if (vacation) {
                            nonWorkingDays[i.toString()] = vacation;
                        } else if (wtrack) {
                            workingHours = wtrack.get([i.toString()]);
                            nonWorkingDays.workingHours += workingHours;

                            nonWorkingDays[i.toString()] = workingHours || '';
                        } else {
                            nonWorkingDays[i.toString()] = '';
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