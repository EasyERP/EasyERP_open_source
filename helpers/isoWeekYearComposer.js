var moment = require('../public/js/libs/moment/moment');

module.exports = function (wTrackObject) {
    "use strict";

    var year = wTrackObject.year;
    var month = wTrackObject.month;
    var week = wTrackObject.week;// it's isoWeek

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

    return year;
};