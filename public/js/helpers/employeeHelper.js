define(['helpers/getVacationHelper', 'helpers/getHolidayHelper'],
    function (getVacation, getHoliday) {
        "use strict";

        var getNonWorkingDaysByWeek = function (year, week, employee, wtrack, callback, context) {
            "use strict";

            getVacation.forEmployeeByWeek(year, week, employee, function (vacations) {
                "use strict";

                getHoliday.byWeek(year, week, function (holidays) {

                    var nonWorkingDays = {};
                    var workingHours = 0;

                    nonWorkingDays.workingHours = 0;

                    for (var i = 1; i <= 7; i++) {

                        if (vacations[i.toString()]) {

                            nonWorkingDays[i.toString()] = vacations[i.toString()];

                        } else if (holidays[i.toString()]) {

                            nonWorkingDays[i.toString()] = holidays[i.toString()];

                        } else if (wtrack) {

                            workingHours = wtrack.get([i.toString()]);
                            nonWorkingDays.workingHours += workingHours;

                            nonWorkingDays[i.toString()] = workingHours || '';

                        } else {

                            nonWorkingDays[i.toString()] = '';

                        }

                    }

                    callback(nonWorkingDays, context);

                })
            });
        };

        return {
            getNonWorkingDaysByWeek: getNonWorkingDaysByWeek
        };
    });