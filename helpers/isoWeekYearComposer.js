var moment = require('../public/js/libs/moment/moment');

module.exports = function (wTrackObject) {
    "use strict";

    var dateByMonth = wTrackObject.dateByMonth;
    var dateByWeek = wTrackObject.dateByWeek.toString();
    var year = Math.floor(dateByMonth / 100);
    var month = dateByMonth - year * 100;
    var week = dateByWeek.slice(4);//it's isoWeek

    week = parseInt(week, 10);

    if (month !== 1 && month !== 12) {
        return year;
    }

    if (week !== 1 && week !== 53) {
        return year;
    }

    if (month === 12 && week === 1) {
        return ++year;
    }

    if (month === 1 && week === 53) {
        return --year;
    }
};