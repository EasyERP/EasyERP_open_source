define([], function () {
    'use strict';
    var getYear = function (_year, _week, _month) {

        var year = parseInt(_year, 10);
        var week = parseInt(_week, 10);
        var month = parseInt(_month, 10);

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

    return {
        getYear: getYear
    };
});
