module.exports = function (tCardBody) {
    var _ = require('lodash');
    var overTimedTcard;
    var dayValue;
    var overTimeDayValue;
    var day;
console.log(tCardBody);
    if (tCardBody._type && tCardBody._type === 'overtime') {
        return null;
    }

    overTimedTcard = _.clone(tCardBody);
    overTimedTcard.length = 0;
    overTimedTcard._type = 'overtime';
    overTimedTcard.worked = 0;

    for (day = 7; day > 0; day--) {
        overTimedTcard[day] = 0;
        dayValue = parseInt(tCardBody[day], 10);
        overTimeDayValue = dayValue - 8;

        if (day === 7 || day === 6) {
            overTimedTcard[day] = dayValue;
            tCardBody[day] = 0;
            overTimedTcard.worked += dayValue;
            tCardBody.worked -= dayValue;
            overTimedTcard.length++;
        } else if (dayValue && overTimeDayValue > 0) {
            overTimedTcard[day] = dayValue - 8;
            tCardBody[day] = 8;
            overTimedTcard.worked += overTimeDayValue;
            tCardBody.worked -= overTimeDayValue;
            overTimedTcard.length++;
        }
    }

    if (overTimedTcard.length) {
        return overTimedTcard;
    }

    return null;
};

