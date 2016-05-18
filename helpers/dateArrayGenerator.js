function generator(startDate, endDate) {
    "use strict";

    var moment = require('../public/js/libs/moment/moment');

    var startIsoYear = startDate.isoWeekYear();
    var startYear = startDate.year();
    var startDateDay = startDate.day();
    var startMonth = startDate.month() + 1;
    var _startMonth = startMonth;
    var startIsoWeek = startDate.isoWeek();
    var firstMondeyDate = moment(startDate).day(1);//can be > then startDate, when startDateDay=0

    var endIsoYear = endDate.isoWeekYear();
    var endYear = endDate.year();
    var endDateDay = endDate.day();
    var endMonth = endDate.month() + 1;
    var endIsoWeek = endDate.isoWeek();

    //we have two different years and need to divide tCard into 2 parts
    var needDivide = endYear !== startYear;

    var duration = endDate.diff(startDate, 'weeks');
    var _dateStr = moment(startDate);
    var weeks = 0;
    var weeksArr = [];

    var i;

    function divider(startDate, endDate, weeksArr) {
        var startMonth = startDate.month() + 1;
        var endMonth = endDate.month() + 1;
        var lastDayInMonth;
        var firstDayInMonth;

        var week = _dateStr.isoWeek();
        var isoYear = _dateStr.isoWeekYear();
        var year = _dateStr.year();
        var month = _dateStr.month() + 1;

        if (endMonth > startMonth) {
            lastDayInMonth = startDate.endOf('month').day();
            firstDayInMonth = endDate.startOf('month').day();

            weeksArr.push({
                dateByWeek : isoYear * 100 + week,
                dateByMonth: year * 100 + month,
                isoYear    : isoYear,
                week       : week,
                year       : year
            });
        }
    }

    for (i = 0; i <= duration; i++) {
        _dateStr = startDate.add(weeks, 'weeks');



        weeksArr.push({
            dateByWeek : isoYear * 100 + week,
            dateByMonth: year * 100 + month,
            isoYear    : isoYear,
            week       : week,
            year       : year
        });
        weeks = weeks || 1;
    }

    return weeksArr;
}

module.exports = generator;
