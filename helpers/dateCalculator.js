var calculateTaskEndDate = function (startDate, estimated) {
    var iWeeks, iDateDiff, iAdjust = 0;

    estimated = estimated * 1000 * 60 * 60;              // estimated in ticks

    var endDate = startDate.getTime() + estimated;
    endDate = new Date(endDate);

    if (endDate < startDate) {
        return -1;
    }                 // error code if dates transposed

    var iWeekday1 = startDate.getDay();                // day of week
    var iWeekday2 = endDate.getDay();

    iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1;   // change Sunday from 0 to 7
    iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;

    if ((iWeekday1 <= 5) && (iWeekday2 <= 5) && (iWeekday1 > iWeekday2)) {
        iAdjust = 1;
    }  // adjustment if both days on weekend

    iWeekday1 = (iWeekday1 <= 5) ? 0 : 1;    // only count weekdays
    iWeekday2 = (iWeekday2 <= 5) ? 0 : 1;
    // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
    iWeeks = Math.floor((endDate.getTime() - startDate.getTime()) / 604800000);

    if (iWeekday1 < iWeekday2) {
        iDateDiff = (iWeeks * 2) + 2 * (iWeekday2 - iWeekday1);
    } else if ((iWeekday1 == iWeekday2) && (iWeekday1 == 0)) {
        iDateDiff = (iWeeks * 2) + 2 * iAdjust;
    } else {
        iDateDiff = (iWeeks * 2) + 2 * (iWeekday1 - iWeekday2);
    }

    //iDateDiff++;
    iDateDiff = iDateDiff * 1000 * 60 * 60 * 24;
    endDate = endDate.getTime() + iDateDiff;
    endDate = new Date(endDate);

    return endDate;
};
var returnDuration = function (StartDate, EndDate) {
    var days = 0;
    if (StartDate && EndDate) {
        var startDate = new Date(StartDate);
        var endDate = new Date(EndDate);
        var tck = endDate - startDate;
        var realDays = (((tck / 1000) / 60) / 60) / 8;

        days = realDays.toFixed(1);
    }
    return days;
};

module.exports = {
    calculateTaskEndDate: calculateTaskEndDate,
    returnDuration: returnDuration

};