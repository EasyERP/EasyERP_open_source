define(['helpers/getVacationHelper', 'helpers/getHolidayHelper'],
    function (getVacation, getHoliday) {

        var getNonWorkingDaysByWeek = function (year, week, employee, wtrack, callback, context) {

            getVacation.forEmployeeByWeek(year, week, employee, function (vacations) {

                getHoliday.byWeek(year, week, function (holidays) {
                    var nonWorkingDays = {};
                    var workingHours = 0;

                    nonWorkingDays.workingHours = 0;

                    for (var i = 1; i <= 7; i++) {

                        if (vacations[i.toString()]) {

                            nonWorkingDays[i.toString()] = vacations[i.toString()];

                        } else if (holidays[i.toString()]) {

                            nonWorkingDays[i.toString()] = holidays[i.toString()];

                        } else {

                            workingHours = wtrack.get([i.toString()])
                            nonWorkingDays.workingHours += workingHours;

                            nonWorkingDays[i.toString()] = workingHours;

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