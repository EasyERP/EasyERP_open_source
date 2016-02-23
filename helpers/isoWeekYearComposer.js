var moment = require('moment');

module.exports = function (wTrackObject) {
    var year = wTrackObject.year;
    var month = wTrackObject.month;
    var week = wTrackObject.week;
    var momentObject;
    var firstNotZeroDay;
    var isoYear;

    if (month != "1" && month != "12"){
        return year;
    } else if (week != "1" && week != "53") {
        return year;
    } else {
        for (var i = 1; i <= 7; i++) {
            if (wTrackObject[i.toString()] != '0') {
                firstNotZeroDay = i;
                break;
            }
        }

        if (month == "1" && week == "53") {
            year--;
        } else if (month == "12" && week == "1") {
            year++;
        }

        momentObject = moment({y: year});
        momentObject.isoWeek(week);
        momentObject.isoWeekday(firstNotZeroDay);

        isoYear = momentObject.year();

        return isoYear;
    }

};