define(['helpers/getVacationHelper', 'helpers/getHolidayHelper'],
    function (getVacation, getHoliday) {

        var getNonWorkingDaysByWeek = function (year, week, employee, callback, context) {

            getVacation.forEmployeeByWeek(year, week, employee, function (vacations) {

                getHoliday.byWeek(year, week, function (holidays) {
                    var nonWorkingDays = {};

                    for (var i = 1; i <= 7; i++) {

                        if (vacations[i.toString()]) {

                            nonWorkingDays[i.toString()] = vacations[i.toString()];

                        } else if (holidays[i.toString()]) {

                            nonWorkingDays[i.toString()] = holidays[i.toString()];
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