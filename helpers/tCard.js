module.exports = function (tCardBody) {
    var _ = require('lodash');
    var overTimedTcard = _.clone(tCardBody);
    var dayValue;
    var overTimeDayValue;
    var day;

    overTimedTcard.length = 0;
    overTimedTcard._type = 'overtime';
    overTimedTcard.worked = 0;

    for (day = 7; day > 0; day--) {
        overTimedTcard[day] = 0;
        dayValue = tCardBody[day];
        overTimeDayValue = dayValue - 8;

        if (dayValue && overTimeDayValue > 0) {
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

