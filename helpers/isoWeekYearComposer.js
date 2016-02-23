var moment = require('moment');

module.exports = function (wTrackObject) {
    "use strict";

    var dateByMonth = wTrackObject.dateByMonth;
    var dateByWeek = wTrackObject.dateByWeek;
    var year = Math.floor(dateByMonth / 100);
    var month = dateByMonth - year * 100;
    var week = dateByWeek - year * 100;
    var momentObject;
    var firstNotZeroDay;
    var isoYear;
    var compare;
    var i;

    if (month !== 1 && month !== 12) {
        return year;
    }

    if (week !== 1 && week !== 53) {
        return year;
    }

    for (i = 1; i <= 7; i++) {
        compare = wTrackObject[i.toString()] && wTrackObject[i.toString()].toString() !== '0';

        if (compare) {
            firstNotZeroDay = i;
            break;
        }
    }

    if (month === 1 && week === 53) {
        year--;
    } else if (month === 12 && week === 1) {
        year++;
    }

    momentObject = moment({y: year});
    momentObject.isoWeek(week);
    momentObject.isoWeekday(firstNotZeroDay);

    isoYear = momentObject.year();

    return isoYear;
};